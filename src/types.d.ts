import type { R2Bucket } from '@cloudflare/workers-types'

export type Bindings = {
    NODE_ENV: string
    PORT: string
    LOGFILES: string
    LOG_LEVEL: string
    TIMEOUT: string
    CACHE_MAX_AGE: string
    BASE_URL: string
    CLOUDFLARE_ZONE_ID: string
    CLOUDFLARE_API_KEY: string
    CLOUDFLARE_EMAIL: string

    R2: R2Bucket
}
