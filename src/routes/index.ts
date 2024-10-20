import { Buffer } from 'buffer'
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs'
import path from 'path'
import crypto from 'crypto'
import { Hono } from 'hono'
import { env, getRuntimeKey } from 'hono/adapter'
import { R2Bucket, D1Database } from '@cloudflare/workers-types'
import { inflate } from 'pako'
import CryptoJS from 'crypto-js'
import { Bindings } from '../types'

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
        // 如果是 Cloudflare Workers，存储到 D1 数据库
        const db = c.env.DB
        const content = JSON.stringify({ encrypted })

        try {
            await db.prepare('INSERT INTO cookie_data (uuid, content) VALUES (?, ?) ON CONFLICT(uuid) DO UPDATE SET content = ?')
                .bind(uuid, content, content)
                .run()
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
    const { password } = await c.req.json()
    const { uuid } = c.req.param()
    if (!uuid) {
        return c.text('Bad Request', 400)
    }

    if (runtime === 'workerd') {
        // 如果是 Cloudflare Workers，从 D1 数据库读取数据
        const db = c.env.DB

        try {
            const results = await db.prepare('SELECT content FROM cookie_data WHERE uuid = ?')
                .bind(uuid)
                .first()

            if (!results) {
                return c.text('Not Found', 404)
            }

            const data = JSON.parse(results.content as string)

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

export default app
