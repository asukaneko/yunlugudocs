# 依赖安装与包说明

本项目集成了多种 VitePress 插件以增强文档的功能和视觉效果。

## 1. 安装依赖

如果你是克隆了此模板，首先需要安装必要的 Node.js 包：

```bash
# 使用 npm 安装
npm install

# 或者使用 pnpm (推荐)
pnpm install
```

## 2. 核心包介绍

### 基础核心
- `vitepress`: 文档站点的核心引擎。

### Nolebase 插件系列 (功能增强)
- `@nolebase/vitepress-plugin-git-changelog`: 自动根据 Git 记录生成页面修改历史和贡献者。
- `@nolebase/vitepress-plugin-page-properties`: 在页面顶部显示字数统计、阅读时间等元数据。
- `@nolebase/vitepress-plugin-enhanced-readabilities`: 提供字号调节、行高调节及阅读模式。

### 交互与美化
- `canvas-confetti`: 五彩纸屑特效。
- `medium-zoom`: 像 Medium 一样的图片缩放功能。
- `nprogress-v2`: 顶部加载进度条。
- `@miletorix/vitepress-back-to-top-button`: 右下角回到顶部按钮。

### Markdown 增强
- `markdown-it-mathjax3`: 支持数学公式渲染。
- `vitepress-plugin-comment-with-giscus`: 基于 GitHub Discussions 的评论系统。

## 3. Giscus 评论插件配置指南

`vitepress-plugin-comment-with-giscus` 允许你的读者通过 GitHub 账号在文档下方留言。

### 配置步骤：
1. **开启 GitHub Discussions**: 在你的 GitHub 仓库设置中勾选 "Discussions"。
2. **安装 Giscus App**: 访问 [giscus.app](https://giscus.app)，按照说明安装并授权你的仓库。
3. **获取参数**: 在 giscus 官网输入你的仓库名，页面会自动生成 `repoId` 和 `categoryId`。
4. **修改代码**: 打开 `.vitepress/theme/index.ts`，在 `setup()` 函数中更新以下部分：

```typescript
giscusTalk({
  repo: 'YOUR_NAME/YOUR_REPO',
  repoId: '你的仓库ID',
  category: 'General', // 建议保持 General
  categoryId: '你的分类ID',
  mapping: 'pathname', // 评论与页面的对应方式
  inputPosition: 'bottom',
  lang: 'zh-CN',
}, { frontmatter, route }, true);
```

### 控制评论显示：
- **全局开启**: 最后一个参数设为 `true`。
- **单页控制**: 在 `.md` 文件的 Frontmatter 中设置 `comment: false` 即可隐藏该页评论。

## 4. 添加新包

如果你需要添加新的插件，建议安装为开发依赖：

```bash
npm install <package-name> --save-dev
```
并在 `docs/.vitepress/config.mts` 中按照插件文档进行配置。
