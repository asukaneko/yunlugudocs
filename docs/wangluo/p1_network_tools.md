# 网络实战：常用命令与调试工具

纸上得来终觉浅。本篇将带你用命令行和浏览器工具，**亲眼看到**网络的运作。每一个命令都是网络工程师（和后端开发者）的日常工具。

::: tip 前置知识
建议先阅读 [网络世界的第一步](./p1_network_basics) 和 [网络协议与分层模型](./p1_network_protocols)，了解 IP、端口、协议等基本概念。
:::

---

# 一、ping — 你的设备能"喊到"目标吗？

## 1.1 什么是 ping？

`ping` 是最基础的网络诊断命令。它向目标设备发送一个小数据包，然后等待回复，以此判断**网络是否连通**以及**延迟有多高**。

> 类比：你朝山谷喊一声"喂"，如果听到回声，说明对面有人。

## 1.2 基本用法

::: code-group
```bash [Windows]
ping www.baidu.com
```

```bash [Mac / Linux]
ping www.baidu.com
# 按 Ctrl+C 停止（Linux/Mac 的 ping 会一直运行）
```
:::

## 1.3 输出解读

```
正在 Ping www.a.shifen.com [110.242.68.3] 具有 32 字节的数据:
来自 110.242.68.3 的回复: 字节=32 时间=12ms TTL=52
来自 110.242.68.3 的回复: 字节=32 时间=11ms TTL=52
来自 110.242.68.3 的回复: 字节=32 时间=13ms TTL=52
来自 110.242.68.3 的回复: 字节=32 时间=12ms TTL=52

110.242.68.3 的 Ping 统计:
    数据包: 已发送 = 4，已接收 = 4，丢失 = 0 (0% 丢失)，
往返行程的估计时间(以毫秒为单位):
    最短 = 11ms，最长 = 13ms，平均 = 12ms
```

| 字段 | 含义 |
|------|------|
| **时间=12ms** | 从发送到收到回复用了 12 毫秒（越小越好） |
| **TTL=52** | 数据包的"剩余跳数"，大致可以推算出经过了多少路由器 |
| **丢失 = 0** | 没有丢包，网络连通良好 |
| **最短/最长/平均** | 延迟的统计数据 |

## 1.4 常见结果解读

| 结果 | 含义 | 可能原因 |
|------|------|---------|
| 正常回复 | 网络连通 | — |
| `请求超时` | 目标没有回复 | 目标设备不在线、防火墙拦截 |
| `无法访问目标主机` | 路由不通 | 路由配置错误 |
| `找不到主机` | DNS 解析失败 | 域名拼写错误、DNS 服务器问题 |

::: info 动手试试
```bash
# ping 本机（永远应该成功）
ping 127.0.0.1

# ping 路由器（检查局域网是否正常）
ping 192.168.1.1

# ping 外网（检查能否访问互联网）
ping www.baidu.com

# ping 一个不存在的地址（看看会怎样）
ping 192.168.1.999
```
:::

---

# 二、traceroute / tracert — 数据经过了哪些"中转站"？

## 2.1 什么是 traceroute？

`ping` 只告诉你"能不能到"，而 `traceroute`（Windows 上叫 `tracert`）告诉你**数据经过了哪些路由器**才到达目的地。

> 类比：快递物流追踪——包裹从发货到签收，经过了哪些中转站。

## 2.2 基本用法

::: code-group
```bash [Windows]
tracert www.baidu.com
```

```bash [Mac / Linux]
traceroute www.baidu.com
```
:::

## 2.3 输出解读

```
通过最多 30 个跃点跟踪到 www.baidu.com 的路由:

  1     1 ms     1 ms     1 ms  192.168.1.1          ← 你的路由器
  2     5 ms     4 ms     5 ms  10.0.0.1             ← 运营商局端
  3     8 ms     7 ms     8 ms  172.16.0.1           ← 运营商骨干网
  4    12 ms    11 ms    12 ms  202.97.xx.xx         ← 国家骨干网
  ...
  8    12 ms    11 ms    13 ms  110.242.68.3         ← 百度服务器
```

每一行代表一个"跳"（hop），就是数据经过的一个路由器。从第 1 跳（你的路由器）到最后（目标服务器），你能看到数据的完整路径。

::: warning 注意
有些路由器会屏蔽 traceroute 的探测包，显示 `* * *`。这是正常的，不代表网络有问题。
:::

---

# 三、ipconfig / ifconfig — 查看自己的网络信息

## 3.1 基本用法

::: code-group
```bash [Windows]
ipconfig
# 查看详细信息（包括 DNS 服务器、MAC 地址等）
ipconfig /all
```

```bash [Mac / Linux]
ifconfig
# 或者更现代的命令
ip addr
```
:::

## 3.2 输出解读（Windows）

```
以太网适配器 以太网:

   连接特定的 DNS 后缀 . . . . . . . :
   IPv4 地址 . . . . . . . . . . . . : 192.168.1.105    ← 你的 IP
   子网掩码  . . . . . . . . . . . . : 255.255.255.0    ← 子网掩码
   默认网关  . . . . . . . . . . . . : 192.168.1.1      ← 路由器地址

无线局域网适配器 WLAN:

   IPv4 地址 . . . . . . . . . . . . : 192.168.1.106    ← WiFi 的 IP
   子网掩码  . . . . . . . . . . . . : 255.255.255.0
   默认网关  . . . . . . . . . . . . : 192.168.1.1
```

| 字段 | 含义 |
|------|------|
| **IPv4 地址** | 你在局域网中的地址 |
| **子网掩码** | 划分网络和主机部分（后面进阶篇会讲） |
| **默认网关** | 出局域网的"大门"，通常就是路由器 |

::: tip 实用场景
- 网络连不上？先用 `ipconfig` 看看有没有拿到 IP 地址。
- 如果 IPv4 地址是 `169.254.x.x`，说明 DHCP 分配失败，设备没有正常连上网络。
:::

---

# 四、nslookup — 手动查 DNS

## 4.1 什么是 nslookup？

`nslookup` 让你手动查询 DNS，看看一个域名对应哪个 IP 地址。

## 4.2 基本用法

```bash
nslookup www.baidu.com
```

## 4.3 输出解读

```
服务器:  dns.local                          ← 你正在用的 DNS 服务器
Address:  192.168.1.1

非权威应答:
名称:    www.a.shifen.com                   ← 实际的域名（百度的 CDN）
Addresses:  110.242.68.3                    ← 对应的 IP 地址
          110.242.68.4
```

## 4.4 指定 DNS 服务器查询

有时候你想用不同的 DNS 服务器来查：

```bash
# 使用 Google 的公共 DNS (8.8.8.8) 来查询
nslookup www.baidu.com 8.8.8.8
```

::: info 常用公共 DNS
| DNS 服务器 | 地址 | 特点 |
|-----------|------|------|
| **阿里 DNS** | `223.5.5.5` | 国内快 |
| **腾讯 DNS** | `119.29.29.29` | 国内快 |
| **Google DNS** | `8.8.8.8` | 全球通用 |
| **Cloudflare DNS** | `1.1.1.1` | 速度快，注重隐私 |
:::

---

# 五、curl — 命令行发 HTTP 请求

## 5.1 什么是 curl？

`curl` 是一个命令行工具，可以在终端里直接发送 HTTP 请求。对于后端开发者来说，它是快速测试接口的利器。

::: warning Windows 用户注意
Windows 10 及以上自带 `curl`。如果你的系统没有，可以安装 [Git for Windows](https://git-scm.com/)，它自带 curl。
:::

## 5.2 发送 GET 请求

```bash
# 最简单的 GET 请求
curl https://www.baidu.com

# 返回的是百度首页的 HTML 源码
```

## 5.3 查看详细的请求和响应头

```bash
curl -v https://www.baidu.com
```

输出中你会看到：

```
> GET / HTTP/1.1              ← 请求行
> Host: www.baidu.com         ← 请求头
> User-Agent: curl/7.68.0
> Accept: */*
>
< HTTP/1.1 200 OK             ← 响应状态码
< Content-Type: text/html      ← 响应头
< Content-Length: 2381
<
<!DOCTYPE html>                ← 响应体（HTML 内容）
```

`>` 开头的是你**发出去**的内容，`<` 开头的是服务器**返回**的内容。

## 5.4 发送 POST 请求

```bash
# 发送 JSON 数据
curl -X POST http://localhost:5000/messages \
  -H "Content-Type: application/json" \
  -d '{"user": "小白", "content": "Hello from curl!"}'
```

| 参数 | 含义 |
|------|------|
| `-X POST` | 指定请求方法为 POST |
| `-H "Content-Type: application/json"` | 设置请求头，告诉服务器发送的是 JSON |
| `-d '{...}'` | 发送的数据体 |

## 5.5 只看响应头

```bash
curl -I https://www.baidu.com
```

```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 2381
Date: Mon, 01 Jan 2026 00:00:00 GMT
Server: BWS/1.0
```

::: info curl 实用技巧
```bash
# 下载文件
curl -O https://example.com/file.zip

# 跟随重定向
curl -L http://baidu.com

# 设置超时（5秒）
curl --max-time 5 https://example.com

# 显示进度条
curl -# -O https://example.com/file.zip
```
:::

---

# 六、netstat — 谁在占用我的端口？

## 6.1 为什么需要 netstat？

开发时经常遇到 "端口 3000 已被占用" 的错误。`netstat`（或 `ss`）可以告诉你**是哪个程序在用这个端口**。

## 6.2 基本用法

::: code-group
```bash [Windows]
# 查看所有监听端口
netstat -ano

# 查找占用 3000 端口的程序
netstat -ano | findstr :3000
```

```bash [Mac / Linux]
# 查看所有监听端口
netstat -tlnp

# 或者用 ss（更现代）
ss -tlnp

# 查找占用 3000 端口的程序
ss -tlnp | grep :3000
```
:::

## 6.3 输出解读

```
协议    本地地址              外部地址              状态        PID
TCP     0.0.0.0:3000         0.0.0.0:0           LISTENING   12345
TCP     0.0.0.0:5000         0.0.0.0:0           LISTENING   67890
TCP     127.0.0.1:27017      0.0.0.0:0           LISTENING   11111
```

| 字段 | 含义 |
|------|------|
| **本地地址** | `0.0.0.0:3000` 表示监听所有网卡的 3000 端口 |
| **状态** | `LISTENING` 表示正在等待连接 |
| **PID** | 进程 ID，可以用来找到对应的程序 |

## 6.4 根据 PID 查找程序

::: code-group
```bash [Windows]
# 查找 PID 为 12345 的程序
tasklist | findstr 12345

# 强制结束该进程
taskkill /PID 12345 /F
```

```bash [Mac / Linux]
# 查找 PID 为 12345 的程序
ps -p 12345

# 结束该进程
kill 12345
# 强制结束
kill -9 12345
```
:::

::: tip 后端开发必备
遇到 "端口被占用" 错误时的排查步骤：
1. `netstat -ano | findstr :端口号`（找到 PID）
2. `tasklist | findstr PID`（找到程序）
3. 决定是关掉它还是换一个端口
:::

---

# 七、浏览器开发者工具 — 最直观的网络调试

## 7.1 打开方式

- **Chrome/Edge**：按 `F12` 或 `Ctrl+Shift+I`（Mac: `Cmd+Option+I`）
- **Firefox**：按 `F12`
- 然后点击 **"Network"（网络）** 标签页

## 7.2 你能看到什么？

刷新页面后，Network 面板会列出**所有的网络请求**：

| 列名 | 含义 |
|------|------|
| **Name** | 请求的资源名称 |
| **Status** | HTTP 状态码（200=成功，404=找不到） |
| **Type** | 资源类型（document、script、image） |
| **Size** | 资源大小 |
| **Time** | 加载耗时 |

## 7.3 查看请求详情

点击任意一个请求，可以看到：

- **Headers（请求头/响应头）**：
  - `Request URL`：请求的完整 URL
  - `Request Method`：GET / POST
  - `Status Code`：200 OK / 404 Not Found 等
  - `Content-Type`：响应数据类型

- **Preview/Response（响应体）**：
  - 如果是 API 请求，可以看到返回的 JSON 数据
  - 如果是网页，可以看到 HTML 源码

- **Timing（耗时分析）**：
  - DNS 解析、TCP 连接、请求等待、响应下载各花了多少时间

::: info 动手试试
1. 打开浏览器，按 `F12` 打开开发者工具
2. 切换到 **Network** 标签页
3. 访问 `https://www.baidu.com`
4. 观察有多少个请求，每个请求的状态码和耗时
5. 点击第一个请求，查看它的 Headers 和 Response
:::

---

# 八、telnet — 手工测试端口连通性

## 8.1 什么是 telnet？

`telnet` 可以用来测试**某个 IP 的某个端口是否开放**。虽然它是一个古老的远程登录工具，但现在更多被用来测试端口连通性。

## 8.2 启用 telnet（Windows）

Windows 默认不启用 telnet，需要手动开启：
1. 打开 "控制面板" → "程序" → "启用或关闭 Windows 功能"
2. 勾选 "Telnet 客户端"
3. 点击确定

## 8.3 测试端口连通性

```bash
# 测试百度的 80 端口是否开放
telnet www.baidu.com 80
```

- **如果屏幕变黑/连接成功** → 端口是通的
- **如果显示"连接失败"** → 端口不通（被防火墙拦截或服务未启动）

## 8.4 用 telnet 手工发 HTTP 请求

连接成功后，你可以手动输入 HTTP 请求：

```
GET / HTTP/1.1
Host: www.baidu.com

（按两次回车）
```

服务器会返回百度首页的 HTML。这是理解 HTTP 协议最直观的方式——你亲手"敲"出了一个 HTTP 请求！

::: warning 注意
Mac 用户也可以使用 `nc`（netcat）代替 telnet：
```bash
nc -v www.baidu.com 80
```
:::

---

# 九、综合排查流程

当你遇到"网络不通"的问题时，可以按照以下步骤排查：

```
1. ping 127.0.0.1           → 本机网络栈是否正常？
   │
   ├─ 失败 → 本机网络配置有问题
   │
   └─ 成功 ↓
   
2. ping 192.168.1.1         → 能到路由器吗？（换成你的网关地址）
   │
   ├─ 失败 → 局域网连接问题（检查 WiFi/网线）
   │
   └─ 成功 ↓
   
3. ping www.baidu.com       → 能到外网吗？
   │
   ├─ 失败 → DNS 或外网路由问题
   │   ├─ nslookup www.baidu.com → DNS 正常吗？
   │   └─ ping 8.8.8.8 → 能到公网 IP 吗？
   │
   └─ 成功 ↓
   
4. curl https://www.baidu.com → HTTP 层面正常吗？
   │
   ├─ 失败 → HTTP/HTTPS 相关问题（证书、代理等）
   │
   └─ 成功 → 网络完全正常！问题可能在应用层
```

::: tip 记住这个顺序
**从下往上排查**：先确认物理连接 → 再查网络层 → 再查应用层。这是网络排障的黄金法则。
:::

---

# 十、命令速查表

| 命令 | 用途 | 平台 |
|------|------|------|
| `ping <地址>` | 测试连通性和延迟 | 全平台 |
| `tracert <地址>` / `traceroute <地址>` | 查看数据经过的路由路径 | Win / Mac&Linux |
| `ipconfig` / `ifconfig` | 查看本机网络配置 | Win / Mac&Linux |
| `nslookup <域名>` | 查询 DNS 解析结果 | 全平台 |
| `curl <URL>` | 命令行发送 HTTP 请求 | 全平台 |
| `netstat -ano` / `ss -tlnp` | 查看端口占用情况 | Win / Mac&Linux |
| `telnet <地址> <端口>` | 测试端口是否开放 | 全平台 |

::: tip 下一步
掌握了这些工具后，你可以：
- 阅读 [网络进阶知识](./p1_network_advanced) 了解更多真实网络环境的概念
- 阅读 [计算机网络](./p1_network) 深入了解浏览器加载网页的完整流程
- 回到 [实战练习](./p4_practice)，用 `curl` 测试你写的 API 接口
:::
