# cookie-cloudflare

## [1.0.3](https://github.com/CaoMeiYouRen/cookie-cloudflare/compare/v1.0.2...v1.0.3) (2024-10-21)


### 🐛 Bug 修复

* 优化 /get/:uuid 路由支持的方法 ([6cc43da](https://github.com/CaoMeiYouRen/cookie-cloudflare/commit/6cc43da))

## [1.0.2](https://github.com/CaoMeiYouRen/cookie-cloudflare/compare/v1.0.1...v1.0.2) (2024-10-21)


### 🐛 Bug 修复

* 优化 解密逻辑，减少不必要的 JSON.parse ([949eb8f](https://github.com/CaoMeiYouRen/cookie-cloudflare/commit/949eb8f))
* 修复 get 请求获取数据时，没有 body 导致的错误 ([67d42ab](https://github.com/CaoMeiYouRen/cookie-cloudflare/commit/67d42ab))

## [1.0.1](https://github.com/CaoMeiYouRen/cookie-cloudflare/compare/v1.0.0...v1.0.1) (2024-10-21)


### ♻ 代码重构

* 修改 部署命令 和 wrangler 配置 ([0210dac](https://github.com/CaoMeiYouRen/cookie-cloudflare/commit/0210dac))
* 增加文件存储到 R2 的 contentType；启用 release ([4919380](https://github.com/CaoMeiYouRen/cookie-cloudflare/commit/4919380))
* 迁移后端存储为 R2 ([65ec49b](https://github.com/CaoMeiYouRen/cookie-cloudflare/commit/65ec49b))


### 🐛 Bug 修复

* 更新部署文档；优化 logger ([c98e800](https://github.com/CaoMeiYouRen/cookie-cloudflare/commit/c98e800))

# 1.0.0 (2024-10-20)


### ✨ 新功能

* 初步实现 CookieCloud 兼容 API ([9e481fc](https://github.com/CaoMeiYouRen/cookie-cloudflare/commit/9e481fc))
