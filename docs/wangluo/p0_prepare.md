# 准备工作：搭建你的开发环境

在开始编写后端代码之前，你需要先在电脑上安装好“生产工具”。对于大一新生来说，环境配置往往是第一个“劝退”环节，请耐心按照以下步骤操作。

## 1. 代码编辑器：VS Code
虽然有很多编辑器，但 **Visual Studio Code (VS Code)** 是目前全球最流行的选择。
- **下载地址**: [code.visualstudio.com](https://code.visualstudio.com/)
- **必装插件**:
  - `Chinese (Simplified)` : 中文语言包。
  - `Python` : Python 开发必备。
  - `ESLint` : JavaScript/Node.js 代码规范检查。
  - `Thunder Client` : (可选) VS Code 内置的 API 测试工具，类似于简化版的 Apifox。

## 2. 编程语言环境

### Python (用于 Flask 学习)
- **下载**: [python.org](https://www.python.org/) (建议下载 3.10 或更高版本)。
- **验证**: 打开终端输入 `python --version`。
- **注意**: Windows 安装时务必勾选 **"Add Python to PATH"**。

### Node.js (用于 Express 学习)
- **下载**: [nodejs.org](https://nodejs.org/) (建议下载 **LTS** 长期支持版本)。
- **验证**: 终端输入 `node -v` 和 `npm -v`。

## 3. 数据库：MongoDB
后端离不开数据存储。
- **本地安装**: [MongoDB Community Server](https://www.mongodb.com/try/download/community)。
- **可视化工具**: 推荐安装 **MongoDB Compass**，它可以让你像看 Excel 表格一样查看数据库内容。

## 4. 终端 (Terminal) 基础
作为后端开发者，你会频繁使用黑窗口（终端）。请尝试掌握以下指令：
- `ls` (Mac/Linux) 或 `dir` (Windows): 查看当前文件夹下的文件。
- `cd 文件夹名`: 进入某个文件夹。
- `mkdir 文件夹名`: 创建新文件夹。
- `pip install xxx`: 安装 Python 的包。
- `npm install xxx`: 安装 Node.js 的包。

---

::: tip 给新生的建议
如果在安装过程中遇到任何“报错”或“红字”，**不要慌张**。
1. 复制报错信息。
2. 粘贴到百度/谷歌/ChatGPT。
3. 99% 的问题前人都遇到过。
:::
