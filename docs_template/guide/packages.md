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

## 3. 添加新包

如果你需要添加新的插件，建议安装为开发依赖：

```bash
npm install <package-name> --save-dev
```
并在 `docs/.vitepress/config.mts` 中按照插件文档进行配置。
