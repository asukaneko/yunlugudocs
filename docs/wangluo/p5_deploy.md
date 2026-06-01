# 部署入门：让你的项目上线

你已经在本地跑通了 Flask 和 Express 项目，用 `http://localhost:5000` 或 `http://localhost:3000` 访问。但只有你自己的电脑能访问——怎么让其他人也能用你的 API？

答案就是**部署（Deployment）**。

::: tip 前置知识
建议先完成 [实战练习](./p4_practice) 中的至少一个任务，确保你的项目在本地能正常运行。
:::

---

# 一、本地 vs 线上

| 对比 | 本地开发 | 线上部署 |
|------|---------|---------|
| **访问地址** | `localhost:5000` | `https://your-api.com` |
| **谁可以访问** | 只有你自己 | 全世界任何人 |
| **运行环境** | 你的电脑 | 远程服务器 |
| **关闭影响** | 关掉终端就没了 | 需要保证 24 小时运行 |
| **安全要求** | 无所谓 | 必须考虑安全 |

```
本地开发：
你的电脑 (localhost)
  ├── Flask/Express 服务
  └── 浏览器访问 localhost:5000   ← 只有你能看到

线上部署：
远程服务器 (云服务器/GitHub Pages/Docker)
  ├── Flask/Express 服务（持续运行）
  └── 任何人访问 https://your-api.com  ← 全世界都能看到
```

---

# 二、GitHub Pages 部署 VitePress 文档站

你正在阅读的这个文档站就是用 GitHub Pages 部署的。

## 2.1 什么是 GitHub Pages？

GitHub Pages 是 GitHub 提供的**免费静态网站托管服务**。只要你把静态文件（HTML/CSS/JS）推送到 GitHub 仓库，GitHub 就会自动帮你托管。

> **类比**：GitHub Pages 就像一个免费的"展示柜"，你把做好的网页放上去，全世界都能看到。

## 2.2 部署 VitePress 的步骤

### 第一步：配置 VitePress 的 base 路径

GitHub Pages 的 URL 格式是 `https://<用户名>.github.io/<仓库名>/`，所以 VitePress 需要设置 `base` 路径：

```typescript
// docs/.vitepress/config.mts
export default defineConfig({
  base: '/yunlugudocs/',  // 仓库名
  // ...其他配置
})
```

### 第二步：确保构建脚本存在

```json
// package.json
{
  "scripts": {
    "docs:build": "vitepress build docs"
  }
}
```

### 第三步：创建 GitHub Actions 工作流

在仓库根目录创建 `.github/workflows/deploy.yml`（详见本篇后续章节）。

### 第四步：在 GitHub 上启用 Pages

1. 打开你的 GitHub 仓库
2. 点击 **Settings** → **Pages**
3. **Source** 选择 **GitHub Actions**
4. 保存

### 第五步：推送代码，自动部署

每次 Push 到 main 分支，GitHub Actions 会自动：
1. 安装依赖
2. 构建 VitePress
3. 部署到 GitHub Pages

几分钟后，你的文档站就能通过 `https://<用户名>.github.io/<仓库名>/` 访问了！

---

# 三、GitHub Actions：自动化构建与部署

## 3.1 什么是 GitHub Actions？

GitHub Actions 是 GitHub 内置的 **CI/CD（持续集成/持续部署）** 工具。它可以在你 Push 代码、创建 PR 等事件发生时，自动执行预定义的任务。

> **类比**：就像一个自动化的"流水线"——你把代码推到 GitHub，它自动帮你构建、测试、部署，完全不用手动操作。

## 3.2 工作流文件结构

```yaml
# .github/workflows/deploy.yml

name: Deploy to GitHub Pages    # 工作流名称

on:                              # 触发条件
  push:
    branches: [main]             # Push 到 main 分支时触发

permissions:                     # 权限设置
  contents: read
  pages: write
  id-token: write

jobs:                            # 要执行的任务
  build:                         # 任务 1：构建
    runs-on: ubuntu-latest       # 运行环境
    steps:
      - uses: actions/checkout@v4        # 拉取代码
      - uses: actions/setup-node@v4      # 安装 Node.js
        with:
          node-version: 20
      - run: npm ci                       # 安装依赖
      - run: npm run docs:build           # 构建文档
      - uses: actions/upload-pages-artifact@v3  # 上传构建产物

  deploy:                        # 任务 2：部署
    needs: build                 # 依赖 build 任务
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4    # 部署到 Pages
```

## 3.3 工作流程图

```
你 Push 代码到 main
        │
        ▼
GitHub Actions 触发
        │
        ▼
┌─────────────────────┐
│      Build 任务      │
│  1. 拉取代码         │
│  2. 安装 Node.js 20  │
│  3. npm ci           │
│  4. npm run docs:build│
│  5. 上传构建产物      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     Deploy 任务      │
│  部署到 GitHub Pages  │
└──────────┬──────────┘
           │
           ▼
   https://<user>.github.io/yunlugudocs/
```

## 3.4 查看部署状态

1. 打开你的 GitHub 仓库
2. 点击 **Actions** 标签页
3. 可以看到每次部署的状态（成功✅/失败❌）
4. 点击具体的 Workflow 可以查看详细的构建日志

::: warning 常见部署失败原因
- `npm ci` 失败 → 检查 `package-lock.json` 是否存在
- 构建失败 → 本地运行 `npm run docs:build` 看看有没有报错
- 404 页面 → 检查 `base` 路径是否和仓库名一致
:::

---

# 四、Docker 基础

本项目也提供了 Docker 部署方式（`Dockerfile` 和 `nginx.conf`）。简单了解一下 Docker 的工作原理。

## 4.1 什么是 Docker？

Docker 是一个**容器化**工具，它把你的应用和所有依赖打包成一个"容器"，在任何机器上都能一模一样地运行。

> **类比**：Docker 容器就像一个"集装箱"——不管你用什么卡车（操作系统），只要能运集装箱，里面装的东西（应用）都能正常工作。

## 4.2 本项目的 Dockerfile 解读

```dockerfile
# 阶段 1：构建
FROM node:22-alpine AS builder    # 用 Node.js 22 镜像
WORKDIR /app                      # 设置工作目录
COPY package*.json ./             # 复制依赖文件
RUN npm ci --omit=dev             # 安装生产依赖
COPY . .                          # 复制所有代码
RUN npm run docs:build            # 构建文档

# 阶段 2：部署
FROM nginx:alpine                 # 用 Nginx 镜像
COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html  # 复制构建产物
COPY nginx.conf /etc/nginx/conf.d/default.conf  # 配置 Nginx
EXPOSE 80                         # 暴露 80 端口
CMD ["nginx", "-g", "daemon off;"]  # 启动 Nginx
```

这是一个**多阶段构建**：
1. 第一阶段用 Node.js 构建 VitePress
2. 第二阶段用 Nginx 托管构建好的静态文件
3. 最终镜像只有 Nginx + 静态文件，非常轻量

## 4.3 常用 Docker 命令

```bash
# 构建镜像
docker build -t yunlugudocs .

# 运行容器
docker run -d -p 8080:80 yunlugudocs
# 然后访问 http://localhost:8080

# 查看运行中的容器
docker ps

# 停止容器
docker stop <容器ID>
```

---

# 五、云服务器部署简介

如果你想部署后端 API（Flask/Express），GitHub Pages 不够用（它只能托管静态文件）。你需要一台**云服务器**。

## 5.1 常见的云服务器

| 平台 | 特点 | 学生优惠 |
|------|------|---------|
| **阿里云** | 国内最大，文档齐全 | 有学生机（9.9 元/月） |
| **腾讯云** | 国内第二大 | 有学生机 |
| **华为云** | 国内第三大 | 有学生机 |
| **AWS** | 全球最大 | 免费套餐（12 个月） |
| **Vercel** | 前端/Serverless 部署 | 免费套餐 |
| **Railway** | 全栈部署 | 免费额度 |

## 5.2 部署流程（通用）

```
1. 购买云服务器，获取公网 IP
2. 用 SSH 登录服务器
   ssh root@你的服务器IP
3. 安装运行环境（Node.js/Python/MongoDB）
4. 上传代码（git clone 或 scp）
5. 安装依赖（npm install / pip install）
6. 启动服务（nohup node app.js &）
7. 配置 Nginx 反向代理
8. 配置域名和 SSL 证书（可选）
```

::: info Vercel：最简单的部署方式
如果你只是想快速把 Express 或 Flask 部署上线试试，[Vercel](https://vercel.com/) 是最简单的选择。它支持 Serverless Functions，免费额度对学习来说完全够用。
:::

---

# 六、环境变量管理

无论在哪里部署，**敏感信息**（数据库密码、API 密钥等）都不应该写在代码里。

## 6.1 使用 .env 文件

```bash
# .env（本地开发用，不要提交到 GitHub）
MONGO_URI=mongodb://localhost:27017/myapp
PORT=3000
JWT_SECRET=my-super-secret-key
```

```javascript
// 在代码中读取
require('dotenv').config();

const mongoUri = process.env.MONGO_URI;
const port = process.env.PORT;
```

## 6.2 安全注意事项

| 做法 | ✅/❌ |
|------|------|
| 把密码写在 `.env` 文件中 | ✅ 正确 |
| 把 `.env` 加入 `.gitignore` | ✅ 必须 |
| 把密码写在代码里 | ❌ 绝对不行 |
| 把 `.env` 提交到 GitHub | ❌ 危险！ |
| 在 GitHub Secrets 中存储密钥 | ✅ 用于 CI/CD |

::: warning 记住
`.env` 文件**绝对不能**提交到 Git。确保你的 `.gitignore` 中包含 `.env`。
:::

---

# 七、小结

| 部署方式 | 适合什么 | 难度 |
|---------|---------|------|
| **GitHub Pages** | 静态文档站、个人博客 | ⭐ 简单 |
| **Docker** | 任何应用的容器化部署 | ⭐⭐ 中等 |
| **Vercel/Railway** | 前端、Serverless API | ⭐⭐ 中等 |
| **云服务器** | 全栈应用、数据库 | ⭐⭐⭐ 较难 |

::: tip 给新生的建议
- 现阶段先把代码写好，部署是锦上添花
- 先尝试 GitHub Pages（本文档站的部署方式）
- 等你熟悉了开发流程，再尝试云服务器部署
- 环境变量管理从一开始就养成好习惯
:::
