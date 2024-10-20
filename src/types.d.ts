import type { D1Database, R2Bucket } from '@cloudflare/workers-types'

export type Bindings = {
    NODE_ENV: string
    PORT: string
    LOGFILES: string
    LOG_LEVEL: string
    TIMEOUT: string
    DB: D1Database
    R2: R2Bucket
}
