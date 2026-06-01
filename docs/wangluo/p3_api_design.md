# RESTful API 设计指南：写出专业的接口

在开始写 Flask 或 Express 之前，你需要先理解**什么是好的 API 设计**。一个好的 API 就像一份清晰的合同——前后端各写各的，只要遵守合同，就能完美协作。

::: tip 前置知识
建议先阅读 [计算机网络](./p1_network) 和 [网络世界的第一步](./p1_network_basics)，了解 HTTP 协议的基本概念。
:::

---

# 一、什么是 REST？

**REST（Representational State Transfer）** 是一种 API 设计风格，不是严格的技术标准。它的核心思想是：**把一切都看作"资源"，用 HTTP 方法来操作这些资源**。

> **类比：文件柜管理**
> 
> 想象一个文件柜（服务器），里面有各种文件夹（资源）。你可以：
> - **查看**某个文件夹的内容（GET）
> - **往**文件夹里**放**一份新文件（POST）
> - **替换**整个文件夹的内容（PUT）
> - **修改**文件夹里的某一页（PATCH）
> - **删除**某个文件夹（DELETE）

REST 的六个核心约束：

| 约束 | 说明 |
|------|------|
| **客户端-服务器分离** | 前端和后端独立开发 |
| **无状态** | 每个请求都包含所有必要信息，服务器不记住客户端状态 |
| **可缓存** | 响应可以被缓存以提高性能 |
| **统一接口** | 使用标准的 HTTP 方法和状态码 |
| **分层系统** | 客户端不需要知道是否直连服务器（可以有代理、CDN） |
| **按需代码（可选）** | 服务器可以返回可执行代码给客户端 |

::: info 你已经在用 REST 了
当你在 Apifox 里测试 `GET /messages` 和 `POST /messages` 时，你就在使用 REST 风格的 API。
:::

---

# 二、HTTP 方法的语义

HTTP 方法（也叫"动词"）告诉服务器你想对资源做什么操作：

| 方法 | 语义 | 示例 | 幂等性 |
|------|------|------|--------|
| **GET** | 获取资源 | `GET /users` 获取所有用户 | ✅ 幂等 |
| **POST** | 创建资源 | `POST /users` 创建新用户 | ❌ 不幂等 |
| **PUT** | 整体替换资源 | `PUT /users/1` 替换用户 1 的全部信息 | ✅ 幂等 |
| **PATCH** | 部分修改资源 | `PATCH /users/1` 只修改用户 1 的某些字段 | ✅ 幂等 |
| **DELETE** | 删除资源 | `DELETE /users/1` 删除用户 1 | ✅ 幂等 |

> **什么是"幂等"？**
> 
> 同一个请求执行一次和执行多次，结果一样。比如 `GET /users` 查 100 次结果都一样；但 `POST /users` 执行 100 次会创建 100 个用户。

::: warning 常见错误
- 用 GET 请求来删除数据 → 违反语义，且浏览器预加载可能误删
- 用 POST 来查询数据 → 应该用 GET
- 所有操作都用 POST → 失去了 REST 的表达力
:::

---

# 三、URL 设计规范

URL（端点路径）的设计直接影响 API 的可读性和易用性。

## 3.1 使用名词复数，不用动词

URL 代表"资源"，资源是名词。

```
✅ 好的：
GET    /users          获取用户列表
GET    /users/1        获取用户 1
POST   /users          创建用户
DELETE /users/1        删除用户 1

❌ 差的：
GET    /getUsers       ← 动词不应该出现在 URL 中
POST   /createUser     ← HTTP 方法已经表达了动作
GET    /deleteUser/1   ← 用 GET 做删除操作，非常危险
```

## 3.2 用层级表达关系

当资源之间有从属关系时，用嵌套路径：

```
/users                    所有用户
/users/1                  用户 1
/users/1/orders           用户 1 的所有订单
/users/1/orders/5         用户 1 的第 5 号订单
```

::: tip 嵌套不要超过 3 层
如果 URL 超过 3 层嵌套（如 `/users/1/orders/5/items/3/reviews`），说明你的 API 设计需要重新考虑了。
:::

## 3.3 查询参数用于过滤、排序、分页

```
GET /users                      获取所有用户
GET /users?role=admin           按角色过滤
GET /users?sort=name&order=asc  按名字升序排列
GET /users?page=2&limit=10     分页：第 2 页，每页 10 条
```

## 3.4 API 版本管理

当 API 需要做不兼容的修改时，使用版本号：

```
/api/v1/users     版本 1
/api/v2/users     版本 2（有破坏性变更）
```

::: info 小项目不需要版本管理
对于你的课程项目和练习，不需要考虑版本管理。知道有这个概念就好。
:::

---

# 四、状态码使用规范

状态码是服务器告诉客户端"发生了什么"的方式。正确使用状态码能让调试变得轻松很多。

## 4.1 最常用的状态码

| 状态码 | 含义 | 使用场景 |
|--------|------|---------|
| **200 OK** | 成功 | GET 请求成功返回数据 |
| **201 Created** | 创建成功 | POST 创建资源成功 |
| **204 No Content** | 成功但无返回体 | DELETE 删除成功 |
| **400 Bad Request** | 参数错误 | 缺少必填字段、格式不对 |
| **401 Unauthorized** | 未认证 | 没登录、Token 过期 |
| **403 Forbidden** | 无权限 | 登录了但没有操作权限 |
| **404 Not Found** | 资源不存在 | 访问不存在的 URL 或 ID |
| **409 Conflict** | 冲突 | 注册时用户名已存在 |
| **500 Internal Server Error** | 服务器错误 | 代码 Bug、数据库挂了 |

## 4.2 状态码分组速记

```
2xx → 成功（放心）
3xx → 重定向（浏览器自动处理）
4xx → 你（客户端）的错 → 检查请求参数
5xx → 我（服务器）的错 → 检查后端代码
```

::: tip 开发时遇到 500 不要慌
500 错误意味着你的后端代码有 Bug。去看终端/控制台的报错信息，99% 的问题都在那里。
:::

---

# 五、请求与响应的 JSON 结构

## 5.1 请求体格式

POST/PUT/PATCH 请求需要携带数据体。使用 JSON 格式：

```json
// POST /users
{
  "name": "张三",
  "email": "zhangsan@example.com",
  "age": 20
}
```

::: warning 注意
请求头中必须设置 `Content-Type: application/json`，否则服务器可能无法解析。
:::

## 5.2 统一响应格式

一个好的 API 应该有**统一的响应结构**，让前端可以统一处理：

```json
// 成功响应
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "张三",
    "email": "zhangsan@example.com"
  }
}

// 列表响应（带分页）
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      { "id": 1, "name": "张三" },
      { "id": 2, "name": "李四" }
    ],
    "total": 100,
    "page": 1,
    "limit": 10
  }
}

// 错误响应
{
  "code": 400,
  "message": "用户名不能为空",
  "data": null
}
```

## 5.3 Flask 实现统一响应格式

```python
from flask import Flask, jsonify

app = Flask(__name__)

def success(data=None, message="success"):
    return jsonify({"code": 200, "message": message, "data": data})

def error(message="error", code=400):
    return jsonify({"code": code, "message": message, "data": None}), code

@app.route('/users/<int:user_id>')
def get_user(user_id):
    user = find_user(user_id)  # 假设的查询函数
    if not user:
        return error("用户不存在", 404)
    return success(user)
```

## 5.4 Express 实现统一响应格式

```javascript
// 封装响应工具函数
const response = {
  success(res, data = null, message = "success") {
    res.json({ code: 200, message, data });
  },
  error(res, message = "error", code = 400) {
    res.status(code).json({ code, message, data: null });
  }
};

// 使用示例
app.get('/users/:id', (req, res) => {
  const user = findUser(req.params.id);  // 假设的查询函数
  if (!user) {
    return response.error(res, "用户不存在", 404);
  }
  response.success(res, user);
});
```

---

# 六、好的 API vs 差的 API

## 6.1 用户管理 API 对比

### ❌ 差的设计

```
GET  /api/getAllUsers
POST /api/addNewUser
POST /api/deleteUser
POST /api/updateUserInfo
GET  /api/searchUserByName?name=张三
```

问题：
- URL 中包含动词（get、add、delete、update）
- 删除操作用 POST
- 没有版本管理
- 命名不统一

### ✅ 好的设计

```
GET    /api/v1/users              获取用户列表
GET    /api/v1/users?name=张三     按名字搜索
GET    /api/v1/users/1            获取用户 1
POST   /api/v1/users              创建用户
PUT    /api/v1/users/1            更新用户 1（整体）
PATCH  /api/v1/users/1            更新用户 1（部分）
DELETE /api/v1/users/1            删除用户 1
```

## 6.2 设计对照表

| 方面 | ❌ 差 | ✅ 好 |
|------|------|------|
| **命名** | `/getUser` | `GET /users` |
| **复数** | `/user` | `/users` |
| **嵌套** | `/getUserOrders` | `/users/1/orders` |
| **查询** | `/searchUser?keyword=x` | `/users?keyword=x` |
| **分页** | `/getUsersByPage?page=1` | `/users?page=1&limit=10` |
| **响应** | 直接返回数组 | `{code, message, data}` |

---

# 七、实战：设计一个留言板 API

结合前面的知识，我们来设计一个留言板的 API：

## 7.1 资源分析

留言板的核心资源是**留言（message）**。

## 7.2 API 设计

| 方法 | URL | 说明 | 请求体 |
|------|-----|------|--------|
| GET | `/api/messages` | 获取所有留言 | 无 |
| GET | `/api/messages/1` | 获取第 1 条留言 | 无 |
| POST | `/api/messages` | 发布新留言 | `{ "user": "小白", "content": "你好" }` |
| PUT | `/api/messages/1` | 完整更新第 1 条留言 | `{ "user": "小白", "content": "修改后的内容" }` |
| PATCH | `/api/messages/1` | 部分更新第 1 条留言 | `{ "content": "只改内容" }` |
| DELETE | `/api/messages/1` | 删除第 1 条留言 | 无 |

## 7.3 响应示例

```json
// GET /api/messages
{
  "code": 200,
  "message": "success",
  "data": [
    { "id": 1, "user": "学长", "content": "欢迎来到云麓谷！", "createdAt": "2026-01-01T00:00:00Z" },
    { "id": 2, "user": "小白", "content": "打卡！第一条留言", "createdAt": "2026-01-02T12:00:00Z" }
  ]
}

// POST /api/messages (创建成功)
{
  "code": 201,
  "message": "留言创建成功",
  "data": { "id": 3, "user": "小白", "content": "新留言", "createdAt": "2026-01-03T09:00:00Z" }
}

// GET /api/messages/999 (不存在)
{
  "code": 404,
  "message": "留言不存在",
  "data": null
}
```

::: tip 试着自己设计
在写 [实战练习](./p4_practice) 之前，先尝试按照本篇的规范来设计你的 API，然后再开始写代码。好的设计能让编码事半功倍。
:::

---

# 八、小结

| 原则 | 要点 |
|------|------|
| **资源用名词** | `/users`，不是 `/getUsers` |
| **方法表语义** | GET 查、POST 增、PUT/PATCH 改、DELETE 删 |
| **状态码要准确** | 200 成功、201 创建、400 客户端错、500 服务器错 |
| **响应格式统一** | `{code, message, data}` |
| **URL 用复数** | `/users` 而不是 `/user` |
| **查询参数做过滤** | `/users?role=admin&page=1` |

::: tip 下一步
有了 API 设计的基础，你可以：
- 学习 [数据库入门](./p3_database) 了解数据如何存储
- 开始动手写 [Flask API](./p3_flask) 或 [Express API](./p3_nodejs)
- 完成 [实战练习](./p4_practice) 中的留言板项目
:::
