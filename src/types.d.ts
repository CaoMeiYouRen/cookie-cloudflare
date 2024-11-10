import type { R2Bucket, KVNamespace } from '@cloudflare/workers-types'

export type Bindings = {
    NODE_ENV: string
    PORT: string
    LOGFILES: string
    LOG_LEVEL: string
    TIMEOUT: string
    CACHE_MAX_AGE: string

    R2: R2Bucket
    KV: KVNamespace
}
