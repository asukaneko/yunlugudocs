# 一、前端与后端的定义与职责

#### 1. 前端（Frontend）
- **定义**：用户直接交互的部分，运行在浏览器端。
- **核心技术**：
  - **HTML**：定义网页结构。
  - **CSS**：控制样式和布局。
  - **JavaScript**：实现交互逻辑（如点击、动画、表单验证）。
- **职责**：
  - 将数据以可视化形式呈现给用户。
  - 处理用户输入（如点击、输入框内容）。
  - 通过HTTP请求与后端通信（如AJAX、Fetch API）。
  - 优化用户体验（如响应式设计、加载速度）。

#### 2. 后端（Backend）
- **定义**：运行在服务器端的逻辑，负责处理核心业务和数据。
- **核心技术**：
  - **语言**：Python（Django/Flask）、Java（Spring）、Node.js、PHP等。
  - **数据库**：MySQL、PostgreSQL、MongoDB等。
  - **服务器**：Nginx、Apache、Tomcat等。
- **职责**：
  - 处理前端请求（如用户登录、订单提交）。
  - 操作数据库（增删改查数据）。
  - 实现业务规则（如权限验证、计算逻辑）。
  - 保障安全（如防SQL注入、身份认证）。

---

# 二、前端与后端的联系
通过**HTTP协议**通信，典型流程如下：
1. **前端请求**：用户操作触发前端代码（如点击登录按钮），前端通过HTTP请求（如`POST /login`）将数据（如用户名/密码）发送到后端。
2. **后端处理**：后端验证数据（如检查密码是否正确），返回结果（如JSON格式的成功或错误信息）。
3. **前端响应**：前端根据后端返回的数据更新页面（如跳转到用户主页，或显示“密码错误”）。

**类比**：  
前端像”餐厅服务员”，负责接待顾客（用户）和传递订单；后端像”厨师”，根据订单（请求）做菜（处理数据），最后由服务员将菜（结果）端给顾客。

**前后端交互时序图**（以登录为例）：

```
用户        浏览器(前端)              服务器(后端)           数据库
 │            │                        │                    │
 │  点击登录   │                        │                    │
 │ ─────────► │                        │                    │
 │            │  POST /login           │                    │
 │            │  {用户名, 密码}         │                    │
 │            │ ──────────────────────►│                    │
 │            │                        │  查询用户数据        │
 │            │                        │ ──────────────────►│
 │            │                        │ ◄──────────────────│
 │            │                        │  验证密码            │
 │            │  {status:”success”,    │                    │
 │            │   token:”xxx”}         │                    │
 │            │ ◄──────────────────────│                    │
 │  页面跳转   │                        │                    │
 │ ◄───────── │                        │                    │
```

---

# 三、用户通过浏览器访问网页的完整流程
以输入网址`www.example.com`为例：

#### 1. **URL解析与DNS查询**
- 浏览器解析URL，提取域名（`example.com`）。
- 通过**DNS（域名系统）**将域名转换为服务器的**IP地址**（如`192.168.1.1`）。

#### 2. **建立TCP连接**
- 浏览器与服务器通过**三次握手**建立TCP连接（确保数据传输可靠）。

#### 3. **发送HTTP请求**
- 浏览器生成HTTP请求报文，例如：
  ```http
  GET /index.html HTTP/1.1
  Host: www.example.com
  ```
- 请求通过TCP连接发送到服务器。

::: info HTTP 请求头常见字段
```http
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: text/html,application/xhtml+xml
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Cookie: session_id=abc123
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```
| 字段 | 含义 |
|------|------|
| **Host** | 目标服务器的域名（必须） |
| **User-Agent** | 浏览器和操作系统信息 |
| **Accept** | 客户端能处理的数据类型 |
| **Accept-Language** | 客户端偏好的语言 |
| **Cookie** | 浏览器存储的会话信息 |
| **Authorization** | 身份认证凭证（如 Token） |
:::

#### 4. **服务器处理请求**
- **后端逻辑**：服务器（如Nginx）接收请求，可能转发给后端应用（如Node.js）。
- **静态资源**：如果是HTML/CSS/JS文件，服务器直接返回文件内容。
- **动态内容**：如需查询数据库（如用户主页数据），后端处理后生成动态内容（如JSON或HTML）。

#### 5. **返回HTTP响应**
- 服务器返回响应报文，例如：
  ```http
  HTTP/1.1 200 OK
  Content-Type: text/html
  
  <html>...</html>
  ```

::: info HTTP 状态码分类
| 状态码范围 | 含义 | 常见例子 |
|-----------|------|---------|
| **1xx** | 信息性响应 | `100 Continue`（继续发送） |
| **2xx** | ✅ 成功 | `200 OK`（成功）、`201 Created`（创建成功） |
| **3xx** | 重定向 | `301 Moved Permanently`（永久重定向）、`302 Found`（临时重定向） |
| **4xx** | ❌ 客户端错误 | `400 Bad Request`（参数错误）、`401 Unauthorized`（未认证）、`403 Forbidden`（无权限）、`404 Not Found`（资源不存在） |
| **5xx** | ❌ 服务器错误 | `500 Internal Server Error`（服务器内部错误）、`502 Bad Gateway`（网关错误）、`503 Service Unavailable`（服务不可用） |

:::

::: info HTTP 响应头常见字段
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 35
Cache-Control: no-cache
Set-Cookie: session_id=xyz789
Access-Control-Allow-Origin: *
```
| 字段 | 含义 |
|------|------|
| **Content-Type** | 响应数据的类型（HTML/JSON/图片等） |
| **Content-Length** | 响应体的字节大小 |
| **Cache-Control** | 缓存策略 |
| **Set-Cookie** | 让浏览器保存 Cookie |
| **Access-Control-Allow-Origin** | 跨域访问控制（CORS） |
:::

#### 6. **浏览器渲染页面**
- **解析HTML**：构建DOM（文档对象模型）树。
- **加载CSS**：构建CSSOM（CSS对象模型）树，结合DOM生成渲染树。
- **执行JavaScript**：可能修改DOM或触发额外请求（如加载图片或调用后端API）。
- **绘制页面**：将渲染树转换为像素，显示在屏幕上。

#### 7. **连接管理**
- **HTTP/1.1**：默认持久连接（可复用TCP连接）。
- **HTTP/2**：多路复用，一个连接可并行处理多个请求。
- **HTTPS**：在HTTP基础上加入TLS加密（如SSL证书验证）。

---

# 四、总结示意图
```
用户输入URL → DNS解析 → TCP连接 → HTTP请求 → 服务器（后端处理） → HTTP响应 → 浏览器渲染 → 用户看到页面
```

通过以上流程，前端与后端协同工作，将动态、交互式的网页呈现给用户。

---

# 五、下一步学习

如果你对本篇涉及的概念（IP 地址、DNS、TCP、HTTP 等）还不太熟悉，我们准备了更详细的入门文档：

| 文档 | 适合谁 | 你会学到 |
|------|--------|---------|
| [**网络世界的第一步**](./p1_network_basics) | 完全零基础 | IP、MAC、DNS、端口、URL 等核心概念 |
| [**网络协议与分层模型**](./p1_network_protocols) | 想理解数据传输原理 | TCP/IP 四层模型、TCP vs UDP、HTTPS、WebSocket |
| [**网络实战工具**](./p1_network_tools) | 想动手体验 | ping、curl、nslookup、开发者工具等实用命令 |
| [**网络进阶知识**](./p1_network_advanced) | 想了解更多 | NAT、子网、防火墙、CDN、Cookie/Session/Token |

::: tip 学习建议
建议按 **基础 → 协议 → 工具 → 进阶** 的顺序学习。不需要一次全部看完，可以在后续的后端开发实践中按需查阅。
:::