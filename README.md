<h1 align="center">cookie-cloudflare </h1>
<p>
  <img alt="Version" src="https://img.shields.io/github/package-json/v/CaoMeiYouRen/cookie-cloudflare.svg" />
  <a href="https://github.com/CaoMeiYouRen/cookie-cloudflare/actions?query=workflow%3ARelease" target="_blank">
    <img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/CaoMeiYouRen/cookie-cloudflare/release.yml?branch=master">
  </a>
  <img src="https://img.shields.io/badge/node-%3E%3D16-blue.svg" />
  <a href="https://github.com/CaoMeiYouRen/cookie-cloudflare#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/CaoMeiYouRen/cookie-cloudflare/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/CaoMeiYouRen/cookie-cloudflare/blob/master/LICENSE" target="_blank">
    <img alt="License: AGPL-3.0" src="https://img.shields.io/github/license/CaoMeiYouRen/cookie-cloudflare?color=yellow" />
  </a>
</p>


> 基于 hono 实现的兼容 [CookieCloud](https://github.com/easychen/CookieCloud) API 的云函数服务，支持 [Cloudflare Workers](https://developers.cloudflare.com/workers/) 部署，数据文件存储到 [Cloudflare R2 Storage](https://developers.cloudflare.com/r2/)

## 🏠 主页

[https://github.com/CaoMeiYouRen/cookie-cloudflare#readme](https://github.com/CaoMeiYouRen/cookie-cloudflare#readme)


## 📦 依赖要求


- node >=16

## 🚀 部署

### Cloudflare Workers 部署

1. 创建 `Cloudflare R2 Storage` 

请参考 [Get started](https://developers.cloudflare.com/r2/get-started/) 创建一个 `R2 bucket`

在 `cookie-cloudflare` 中，默认的 `R2 bucket`名称是 `cookie-cloudflare`。

2. 修改 `wrangler.toml` 配置文件。

```toml
name = "cookie-cloudflare"
main = "dist/app.mjs"
minify = true
compatibility_date = "2024-10-20"
compatibility_flags = ["nodejs_compat"]

[[r2_buckets]]
binding = "R2"
bucket_name = "cookie-cloudflare" # 修改此处的 bucket_name 为你创建的 R2 bucket 名称
```

3. 构建并部署到 `Cloudflare Workers`

```sh
npm run build && npm run deploy:wrangler
```

### Docker 镜像

在通过 Docker 部署的情况下，`cookie-cloudflare` 和 `CookieCloud` 的实现是一样的，因此可以直接使用 `CookieCloud`。

但如果你还是想通过 Docker 部署，请参考以下内容。

支持两种注册表：

- Docker Hub: [`caomeiyouren/cookie-cloudflare`](https://hub.docker.com/r/caomeiyouren/cookie-cloudflare)
- GitHub: [`ghcr.io/caomeiyouren/cookie-cloudflare`](https://github.com/CaoMeiYouRen/cookie-cloudflare/pkgs/container/cookie-cloudflare)

支持以下架构：

- `linux/amd64`
- `linux/arm64`

有以下几种 tags：

| Tag            | 描述     | 举例          |
| :------------- | :------- | :------------ |
| `latest`       | 最新     | `latest`      |
| `{YYYY-MM-DD}` | 特定日期 | `2024-06-07`  |
| `{sha-hash}`   | 特定提交 | `sha-0891338` |
| `{version}`    | 特定版本 | `1.2.3`       |

### Docker Compose 部署

下载 [docker-compose.yml](https://github.com/CaoMeiYouRen/cookie-cloudflare/blob/master/docker-compose.yml)

```sh
wget https://raw.githubusercontent.com/CaoMeiYouRen/cookie-cloudflare/refs/heads/master/docker-compose.yml
```

检查有无需要修改的配置

```sh
vim docker-compose.yml  # 也可以是你喜欢的编辑器
```
启动

```sh
docker-compose up -d
```

在浏览器中打开 `http://{Server IP}:3000` 即可查看结果

### Node.js 部署

确保本地已安装 Node.js 和 pnpm。

```sh
# 下载源码
git clone https://github.com/CaoMeiYouRen/cookie-cloudflare.git  --depth=1
cd cookie-cloudflare
# 安装依赖
pnpm i --frozen-lockfile
# 构建项目
pnpm build
# 启动项目
pnpm start
```

在浏览器中打开 `http://{Server IP}:3000` 即可查看结果

### Vercel 部署(暂不支持)

暂不支持，如有需要，请提 issue。

## 🛠️ 开发

```sh
npm run dev:wrangler
```

## 🔧 编译

```sh
npm run build
```

## 🔍 Lint

```sh
npm run lint
```

## 💾 Commit

```sh
npm run commit
```


## 👤 作者


**CaoMeiYouRen**

* Website: [https://blog.cmyr.ltd/](https://blog.cmyr.ltd/)

* GitHub: [@CaoMeiYouRen](https://github.com/CaoMeiYouRen)


## 🤝 贡献

欢迎 贡献、提问或提出新功能！<br />如有问题请查看 [issues page](https://github.com/CaoMeiYouRen/cookie-cloudflare/issues). <br/>贡献或提出新功能可以查看[contributing guide](https://github.com/CaoMeiYouRen/cookie-cloudflare/blob/master/CONTRIBUTING.md).

## 💰 支持

如果觉得这个项目有用的话请给一颗⭐️，非常感谢

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=CaoMeiYouRen/cookie-cloudflare&type=Date)](https://star-history.com/#CaoMeiYouRen/cookie-cloudflare&Date)

## 📝 License

Copyright © 2024 [CaoMeiYouRen](https://github.com/CaoMeiYouRen).<br />
This project is [AGPL-3.0](https://github.com/CaoMeiYouRen/cookie-cloudflare/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [cmyr-template-cli](https://github.com/CaoMeiYouRen/cmyr-template-cli)_
