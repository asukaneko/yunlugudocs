# 部署指南 (Docker)

本项目支持使用 Docker 进行快速部署。通过多阶段构建，我们可以获得一个极其精简且高效的运行镜像。

## 1. 构建镜像

在项目根目录下运行以下命令：

```bash
docker build -t my-vitepress-site .
```

## 2. 运行容器

使用以下命令启动站点：

```bash
docker run -d -p 8080:80 --name my-docs my-vitepress-site
```

访问 `http://localhost:8080` 即可查看站点。

## 3. 构建流程说明

Dockerfile 分为两个阶段：
1. **Builder 阶段**: 使用 Node.js 环境安装所有依赖并执行 `npm run docs:build`。
2. **Nginx 阶段**: 仅从 Builder 阶段复制生成的静态文件（`dist` 目录）到 Nginx 服务器中。

这种方式确保了你的生产环境镜像中不包含源代码和 `node_modules`，安全性更高，体积更小。
