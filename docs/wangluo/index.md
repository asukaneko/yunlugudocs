# “后端基本模式”：  
A. 架构层面——**代码/系统如何分层、如何与外界交互**；  
B. 通信层面——**一次请求从浏览器到数据库再回来的生命流程**。  

一、架构层面：最简四层模型（单体 & 微服务通用）
----------------------------------------
Router 层（入口）  
├─ 接收 HTTP/TCP 报文 → 鉴权 → 路由 → 把“原始请求”转成 DTO 
Service 层（业务）  
├─ 编排业务规则，一次用例一个 Service 方法，**不碰任何技术细节**  
Repository/DAO 层（数据）  
├─ 只负责 CRUD，把“技术细节（SQL、缓存、ORM）”藏起来  
Domain/Model 层（核心）  
├─ 纯 POJO/Entity + 业务行为（如 order.pay()），**不依赖任何框架**

依赖方向：Router → Service → Repository → Domain（**向内依赖**）。  
这样不管换 Spring、换 Dubbo、换数据库，都只在最外层动刀。

----------------------------------------
二、通信层面：一次请求的“7 站闭环”
---------------------------------------
① 浏览器发出 HTTP 请求  
② 网关（Nginx/Kong）做 TLS 终止、限流、路由  
③ Web 容器（Tomcat/Netty）把字节包解析成 HttpServletRequest  
④ Router 层 → 参数校验 → 身份认证（JWT/OAuth2）  
⑤ Service 层 → 组合 Repository 完成业务用例  
⑥ Repository 层 → SQL/缓存/消息队列 拿数据并写回  
⑦ 把 Domain 对象转成 DTO/VO，经序列化（JSON/Proto）→ 浏览器
