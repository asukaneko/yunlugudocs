# 快速上手

按照以下步骤使用此模板启动您的新文档项目：

## 1. 切换文件夹

在项目根目录下，执行以下操作：

1. 将原有的 `docs` 文件夹备份或删除（如果你不再需要它）。
2. 将 `docs_template` 文件夹重命名为 `docs`。

```bash
# 备份现有 docs
mv docs docs_backup
# 将模板应用为 docs
cp -r docs_template docs
```

## 2. 修改基础配置

打开 `docs/.vitepress/config.mts`，修改以下信息：

- `title`: 你的站点标题。
- `description`: 站点描述。
- `repoURL`: 你的 GitHub 仓库地址（用于显示 Git 日志）。
- `socialLinks`: 你的社交链接。
- `editLink`: 页面底部的编辑链接。

## 3. 开始编写

在 `docs/` 目录下创建 `.md` 文件。
如果你需要修改侧边栏，请编辑 `config.mts` 中的 `sidebar` 部分。

## 4. 预览与发布

```bash
# 本地开发预览
npm run docs:dev

# 构建静态站点
npm run docs:build
```
