import { existsSync, mkdirSync } from 'fs'
import path from 'path'
import crypto from 'crypto'
import { readFile, writeFile } from 'fs-extra'
import { Hono } from 'hono'
import { env, getRuntimeKey } from 'hono/adapter'
import { inflate } from 'pako'
import CryptoJS from 'crypto-js'
import { cache } from 'hono/cache'
import { R2GetOptions } from '@cloudflare/workers-types'
import dayjs from 'dayjs'
import { Bindings } from '../types'
import logger from '@/middlewares/logger'

const runtime = getRuntimeKey()
let dataDir: string
if (runtime === 'node') {
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
    // type 是加密方式，用于向下兼容
    // type = 'crypto-js' | 'crypto'
    const { encrypted, uuid, type } = body
    if (!encrypted || !uuid) {
        return c.text('Bad Request', 400)
    }
    const content = JSON.stringify({ encrypted, type })
    if (runtime === 'workerd') {
        // 如果是 Cloudflare Workers，存储到 R2
        const r2 = c.env.R2
        if (!r2) {
            logger.error('R2 binding is undefined')
            return c.text('Internal Server Error', 500)
        }
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
    await writeFile(filePath, content)

    if (await readFile(filePath, 'utf-8') === content) {
        return c.json({ action: 'done' })
    }
    return c.json({ action: 'error' })
})

// 处理数据获取请求
app.on(['GET', 'POST'], '/get/:uuid', (c, next) => {
    const CACHE_MAX_AGE = parseInt(env(c).CACHE_MAX_AGE) || 7200
    return cache({
        cacheName: `${c.req.method} /get/:uuid`,
        cacheControl: `max-age=${CACHE_MAX_AGE}`,
        // keyGenerator: (c2) => {
        //     return `${c2.req.url}`
        // },
    })(c, next)
}, async (c) => {
    let body = {} as Record<string, string>
    const contentType = c.req.header('Content-Type')
    if (contentType?.includes('application/x-www-form-urlencoded')) {
        body = await c.req.parseBody() as Record<string, string>
    } else if (contentType?.includes('application/json')) {
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
            // 使用 onlyIf 选项获取最新的对象
            const options: R2GetOptions = {
                onlyIf: {
                    uploadedAfter: dayjs().add(-18, 'hours').toDate(),
                },
            }
            const object = await r2.get(uuid, options)
            if (!object) {
                return c.text('Not Found', 404)
            }
            const dataText = await object.text()
            if (!password) {
                c.header('Content-Type', 'application/json')
                return c.text(dataText)
            }
            // type 是加密方式，用于向下兼容
            // type = 'crypto-js' | 'crypto'
            const { type, encrypted } = JSON.parse(dataText)
            if (type === 'crypto') {
                const decrypted = cookieDecryptNative(uuid, encrypted, password)
                return c.json(decrypted)
            }
            const decrypted = cookieDecrypt(uuid, encrypted, password)
            return c.json(decrypted)
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
    const dataText = await readFile(filePath, 'utf-8')
    if (!dataText) {
        return c.text('Internal Server Error', 500)
    }
    if (!password) {
        c.header('Content-Type', 'application/json')
        return c.text(dataText)
    }
    const { type, encrypted } = JSON.parse(dataText)
    if (type === 'crypto') {
        const decrypted = cookieDecryptNative(uuid, encrypted, password)
        return c.json(decrypted)
    }
    const decrypted = cookieDecrypt(uuid, encrypted, password)
    return c.json(decrypted)
})

// 解密函数
function cookieDecrypt(uuid: string, encrypted: string, password: string) {
    const the_key = CryptoJS.MD5(`${uuid}-${password}`).toString().substring(0, 16)
    const decrypted = CryptoJS.AES.decrypt(encrypted, the_key).toString(CryptoJS.enc.Utf8)
    return JSON.parse(decrypted)
}

// 解密函数 (原生)，效率更高
function cookieDecryptNative(uuid: string, encrypted: string, password: string) {
    const the_key = crypto.createHash('md5').update(`${uuid}-${password}`).digest('hex').substring(0, 16)
    const decipher = crypto.createDecipheriv('aes-128-cbc', the_key, the_key)
    let decrypted = decipher.update(encrypted, 'base64', 'utf8')
    decrypted += decipher.final('utf8')
    return JSON.parse(decrypted)
}

export default app
