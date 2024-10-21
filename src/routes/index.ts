import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs'
import path from 'path'
import { Hono } from 'hono'
import { getRuntimeKey } from 'hono/adapter'
import { inflate } from 'pako'
import CryptoJS from 'crypto-js'
import { Bindings } from '../types'
import logger from '@/middlewares/logger'

const runtime = getRuntimeKey()
let dataDir: string
if (runtime !== 'workerd') {
    // 设置数据目录
    dataDir = path.join(process.cwd(), 'data')
    if (!existsSync(dataDir)) {
        mkdirSync(dataDir)
    }
}

const app = new Hono<{ Bindings: Bindings }>()

// 处理数据更新请求
app.post('/update', async (c) => {
    let body = {} as Record<string, string>
    const contentEncoding = c.req.header('Content-Encoding')

    if (contentEncoding === 'gzip') {
        // 如果是 gzip 压缩的，先解压
        const decompressedBody = inflate(await c.req.arrayBuffer(), { to: 'string' })
        body = JSON.parse(decompressedBody)// 解析 gzip
    }

    const { encrypted, uuid } = body
    if (!encrypted || !uuid) {
        return c.text('Bad Request', 400)
    }

    if (runtime === 'workerd') {
        // 如果是 Cloudflare Workers，存储到 R2
        const r2 = c.env.R2
        if (!r2) {
            logger.error('R2 binding is undefined')
            return c.text('Internal Server Error', 500)
        }
        const content = JSON.stringify({ encrypted })

        try {
            await r2.put(uuid, content, {
                httpMetadata: {
                    contentType: 'application/json', // 设置文件 Content-Type 为 application/json
                },
            })
            return c.json({ action: 'done' })
        } catch (error) {
            console.error(error)
            return c.json({ action: 'error' })
        }
    }
    // 否则，存储到本地 data 文件夹
    const filePath = path.join(dataDir, `${uuid}.json`)
    const content = JSON.stringify({ encrypted })
    writeFileSync(filePath, content)

    if (readFileSync(filePath).toString() === content) {
        return c.json({ action: 'done' })
    }
    return c.json({ action: 'error' })
})

// 处理数据获取请求
app.all('/get/:uuid', async (c) => {
    let body = {} as Record<string, string>
    const contentType = c.req.header('Content-Type')
    if (contentType === 'application/x-www-form-urlencoded') {
        body = await c.req.parseBody() as Record<string, string>
    } else if (contentType === 'application/json') {
        body = await c.req.json()
    }
    const { password } = body
    const { uuid } = c.req.param()
    if (!uuid) {
        return c.text('Bad Request', 400)
    }

    if (runtime === 'workerd') {
        // 如果是 Cloudflare Workers，从 R2 获取数据
        const r2 = c.env.R2
        if (!r2) {
            logger.error('R2 binding is undefined')
            return c.text('Internal Server Error', 500)
        }
        try {
            const object = await r2.get(uuid)
            if (!object) {
                return c.text('Not Found', 404)
            }

            const data = JSON.parse(await object.text())

            if (password) {
                const decrypted = cookieDecrypt(uuid, data.encrypted, password)
                return c.json(decrypted)
            }
            return c.json(data)

        } catch (error) {
            console.error(error)
            return c.text('Internal Server Error', 500)
        }
    }
    // 否则，从本地 data 文件夹读取数据
    const filePath = path.join(dataDir, `${uuid}.json`)
    if (!existsSync(filePath)) {
        return c.text('Not Found', 404)
    }

    const data = JSON.parse(readFileSync(filePath).toString())
    if (!data) {
        return c.text('Internal Server Error', 500)
    }

    if (password) {
        const decrypted = cookieDecrypt(uuid, data.encrypted, password)
        return c.json(decrypted)
    }
    return c.json(data)

})

// 解密函数
function cookieDecrypt(uuid: string, encrypted: string, password: string) {
    const the_key = CryptoJS.MD5(`${uuid}-${password}`).toString().substring(0, 16)
    const decrypted = CryptoJS.AES.decrypt(encrypted, the_key).toString(CryptoJS.enc.Utf8)
    const parsed = JSON.parse(decrypted)
    return parsed
}

// function cookieDecrypt(uuid: string, encrypted: string, password: string) {
//     // 生成密钥
//     const the_key = crypto.createHash('md5').update(`${uuid}-${password}`).digest('hex').substring(0, 16);

//     // 解密
//     const decipher = crypto.createDecipheriv('aes-128-ecb', Buffer.from(the_key, 'utf8'), '');
//     let decrypted = decipher.update(encrypted, 'base64', 'utf8');
//     decrypted += decipher.final('utf8');

//     // 解析 JSON
//     const parsed = JSON.parse(decrypted);
//     return parsed;
// }

export default app
