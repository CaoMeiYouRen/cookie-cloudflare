# cookie-cloudflare

# [1.5.0](https://github.com/CaoMeiYouRen/cookie-cloudflare/compare/v1.4.1...v1.5.0) (2026-02-07)


### ✨ 新功能

* 添加 Cloudflare 缓存刷新功能；更新配置项以支持新变量 ([ef69717](https://github.com/CaoMeiYouRen/cookie-cloudflare/commit/ef69717))

## [1.4.1](https://github.com/CaoMeiYouRen/cookie-cloudflare/compare/v1.4.0...v1.4.1) (2025-04-03)


### 🐛 Bug 修复

* 修改缓存时间设置为3600秒；更新依赖项配置 ([5977c1c](https://github.com/CaoMeiYouRen/cookie-cloudflare/commit/5977c1c))

# [1.4.0](https://github.com/CaoMeiYouRen/cookie-cloudflare/compare/v1.3.1...v1.4.0) (2024-12-14)


### ✨ 新功能

* 添加 Bun 运行时支持；添加 Docker 支持；优化 CI 流程；优化 Docker 镜像最小化脚本；支持 Bun 运行时数据目录设置 ([45cd3d9](https://github.com/CaoMeiYouRen/cookie-cloudflare/commit/45cd3d9))

## [1.3.1](https://github.com/CaoMeiYouRen/cookie-cloudflare/compare/v1.3.0...v1.3.1) (2024-12-08)


### 🐛 Bug 修复

* **routes:** 修复缓存条件判断；更新缓存最大时间配置 ([08a89d0](https://github.com/CaoMeiYouRen/cookie-cloudflare/commit/08a89d0))

# [1.3.0](https://github.com/CaoMeiYouRen/cookie-cloudflare/compare/v1.2.2...v1.3.0) (2024-11-10)


### ✨ 新功能

* 添加 Cloudflare Workers KV 缓存支持 ([fe5a13f](https://github.com/CaoMeiYouRen/cookie-cloudflare/commit/fe5a13f))

## [1.2.2](https://github.com/CaoMeiYouRen/cookie-cloudflare/compare/v1.2.1...v1.2.2) (2024-11-06)


### 🐛 Bug 修复

* 修复 worker 不支持 crypto.createDecipheriv 的问题 ([b6ad93e](https://github.com/CaoMeiYouRen/cookie-cloudflare/commit/b6ad93e))

## [1.2.1](https://github.com/CaoMeiYouRen/cookie-cloudflare/compare/v1.2.0...v1.2.1) (2024-11-06)


### 🐛 Bug 修复

* 修复 fs 导入错误；修复 crypto 未指定 iv 的问题 ([27f092d](https://github.com/CaoMeiYouRen/cookie-cloudflare/commit/27f092d))

# [1.2.0](https://github.com/CaoMeiYouRen/cookie-cloudflare/compare/v1.1.2...v1.2.0) (2024-11-06)


### ✨ 新功能

* 增加 原生 crypto 解密支持 ([ef3ca74](https://github.com/CaoMeiYouRen/cookie-cloudflare/commit/ef3ca74))

## [1.1.2](https://github.com/CaoMeiYouRen/cookie-cloudflare/compare/v1.1.1...v1.1.2) (2024-11-02)


### 🐛 Bug 修复

* 更改缓存时间长度 ([8123573](https://github.com/CaoMeiYouRen/cookie-cloudflare/commit/8123573))

## [1.1.1](https://github.com/CaoMeiYouRen/cookie-cloudflare/compare/v1.1.0...v1.1.1) (2024-10-22)


### 🐛 Bug 修复

* 修复 R2 可能会获取到旧对象的问题 ([032b1c7](https://github.com/CaoMeiYouRen/cookie-cloudflare/commit/032b1c7))

# [1.1.0](https://github.com/CaoMeiYouRen/cookie-cloudflare/compare/v1.0.4...v1.1.0) (2024-10-22)


### ✨ 新功能

* 新增 缓存配置 ([ec62cd8](https://github.com/CaoMeiYouRen/cookie-cloudflare/commit/ec62cd8))

## [1.0.4](https://github.com/CaoMeiYouRen/cookie-cloudflare/compare/v1.0.3...v1.0.4) (2024-10-21)


### 🐛 Bug 修复

* 修复 contentType 可能为 undefined 的问题 ([0e44a7f](https://github.com/CaoMeiYouRen/cookie-cloudflare/commit/0e44a7f))

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
