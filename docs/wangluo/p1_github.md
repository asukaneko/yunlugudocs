# 一、Git：分布式版本控制工具
#### 1. 定位
- 开源的**分布式版本控制系统**（DVCS），由 Linus Torvalds 2005 年为 Linux 内核开发。
- 作用：追踪代码变更、并行开发、回退历史、多人协同。

#### 2. 核心概念（一张图记牢）
```
工作区（Working Directory）
   ↓ git add
暂存区（Index/Stage）
   ↓ git commit
本地仓库（.git）
   ↓ git push
远程仓库（GitHub/GitLab/Gitee）
```

#### 3. 日常高频命令
| 场景 | 命令 |
|----|------|
| 初始化 | `git init` |
| 克隆远程仓库 | `git clone <URL>` |
| 查看状态 | `git status` |
| 加入暂存区 | `git add .` 或 `git add -p`（交互式） |
| 提交 | `git commit -m "feat: 新增支付模块"` |
| 查看历史 | `git log --oneline --graph` |
| 分支 | `git branch`、`git switch -c feature/x` |
| 合并 | `git merge --no-ff feature/x` |
| 回退 | `git reset --hard HEAD~1` |
| 远程同步 | `git pull --rebase`、`git push -u origin main` |

#### 4. 分布式 vs 集中式
- **分布式**：每个开发者本地都有完整仓库历史，可离线提交、分支、回退。
- **集中式**（如 SVN）：必须联网提交，服务器单点故障风险高。

---

# 二、GitHub：基于 Git 的云端协作平台
#### 1. 定位
- **托管 Git 仓库的云端社区** + **DevOps 工具集市**。
- 2023 年用户破 1 亿，全球最大开源生态。

#### 2. 核心功能
| 功能 | 一句话说明 | 典型用法 |
|------|------------|----------|
| Repository | 云端仓库 | 开源项目 `facebook/react` |
| Fork | 一键复制别人仓库到自己账号下 | 贡献第三方项目 |
| Pull Request | “我改好了，请审查合并” | 开源贡献、团队 Code Review |
| Issue | 缺陷/需求/讨论 | 贴 Bug、提需求、关联 PR |
| Action | CI/CD 工作流 | push 自动跑测试、部署 |
| Wiki / Projects | 文档与看板 | 写说明书、敏捷看板 |
| Codespaces | 云端 VS Code 开发容器 | 零配置在线开发 |
| Packages | 私有包托管 | Docker、npm、Maven 包 |

#### 3. 社交化协作流程（以贡献 React 为例）
1. Fork `facebook/react` → 克隆到本地
2. 新建分支 `fix-typo`
3. 改完 `git commit` → `git push` 到自己仓库
4. 在 GitHub 发 Pull Request，填写模板，触发 CI
5. 维护者 Review → 合并 → 自动关闭 Issue / 部署文档

---

# 三、IDE 中的 Git 集成：可视化与效率利器
现代 IDE 都把 Git 做成“点点鼠标”就能完成 90% 操作，降低记忆成本。

| IDE | 内置名称 | 亮点 | 常用操作入口 |
|-----|----------|------|---------------|
| **VS Code** | Source Control 面板 | 1. 行内 diff 颜色条<br>2. 冲突 3-way 合并器<br>3. GitLens 插件：逐行 blame、代码作者 | 左侧图标 → √ = commit<br>… → Pull、Push、Branch |
| **IntelliJ IDEA / WebStorm** | Git 工具窗口 | 1. 一键 Cherry-Pick、Rebase 交互式<br>2. Commit 窗口分屏看 diff<br>3. 内置 GPG 签名 | 右下角 Git 分支 → New Branch<br>顶部 Git 菜单 → Rebase/Merge |
| **Eclipse** | EGit 插件 | 与 Eclipse 项目模型深度整合，支持 Gerrit | Team → Share Project → 右键 → Compare、Commit |
| **Visual Studio** | Team Explorer | 绑定 Azure DevOps、GitHub 企业版，支持拉取请求 | 团队资源管理器 → Changes → 同步 |

#### 1. 通用可视化能力
- **行内 blame**：悬停显示作者、时间、commit。
- **Conflict Solver**：3 栏视图（本地 | 结果 | 远程），一键 Accept。
- **History Graph**：分支合并图，可回退、Rebase、Cherry-Pick。
- **Stash**：临时搁置代码，换分支修 Bug 无压力。

#### 2. 最佳实践小贴士
1. 开项目第一件事：`git config user.name / user.email` 配好身份。
2. 用 `.gitignore` 模板（github/gitignore）过滤 IDE 缓存、编译产物。
3. Commit 粒度：一次只做一件事，写清楚“动词 + 对象”。
4. Push 前：`git fetch` + `rebase` 保持线性历史，减少 merge noise。
5. 保护主分支：在 GitHub Settings → Branches → Add rule → Require PR review + CI pass。

---

# 四、三者的关系一张图
```
本地 Git 仓库 ←→ 远程 GitHub 仓库
     ↑ 使用 Git 命令或 IDE Git 可视化工具
开发者电脑（VS Code / IDEA / Eclipse）
```

- **Git** 是“发动机”——提供版本控制原子能力。
- **GitHub** 是“云车库”+“社交平台”——存代码、Review、CI/CD。
- **IDE 集成** 是“自动挡”——让发动机操作更丝滑，不用死记离合。

掌握这三层，你就可以：
- 零命令行，用 VS Code 完成分支、commit、PR。
- 在地铁上离线写代码，回家 push 同步到 GitHub。
- 向全世界开源项目提交第一个 Pull Request！