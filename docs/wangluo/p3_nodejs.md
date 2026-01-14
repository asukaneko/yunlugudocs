# 一、项目概览：用 Node.js 做一个「用户管理」后端

本节带你用 **Node.js + Express + MongoDB**，实现一个符合 **MVC 架构** 的 RESTful API，功能是最常见的「用户管理系统」。

整体技术选型：
- 运行环境：Node.js
- Web 框架：Express
- 数据库：MongoDB
- ORM 工具：Mongoose
- 配置管理：dotenv（读取 `.env`）

最终目录结构：

```plaintext
my-backend-app/
├── package.json          # 项目依赖配置
├── .env                  # 环境变量（端口、数据库地址等）
└── src/
    ├── app.js            # 程序入口
    ├── config/
    │   └── db.js         # 数据库连接配置
    ├── controllers/
    │   └── userController.js # 控制器：业务逻辑
    ├── models/
    │   └── User.js       # 数据模型：用户表结构
    └── routes/
        └── userRoutes.js # 路由：URL ↔ 控制器
```

可以和 Python 小节里的 Flask 对照着看：路由层负责“接请求”、控制器负责“写业务逻辑”、模型负责“和数据库打交道”，入口文件负责“把一切拼起来并启动服务”。

---

# 二、初始化 Node.js 项目与依赖

在本地新建一个空文件夹 `my-backend-app`，在终端进入该目录。

1. 初始化项目

```bash
npm init -y
```

2. 安装核心依赖

- `express`：Web 框架
- `mongoose`：操作 MongoDB 的库
- `dotenv`：读取 `.env` 中的环境变量

```bash
npm install express mongoose dotenv
```

3. 安装开发依赖

- `nodemon`：开发时代码改动自动重启服务

```bash
npm install --save-dev nodemon
```

4. 在 `package.json` 中补充启动脚本

```json
"scripts": {
  "start": "node src/app.js",
  "dev": "nodemon src/app.js"
}
```

---

# 三、配置层：环境变量与数据库连接

## 3.1 `.env`：环境变量

在项目根目录创建 `.env` 文件，用来存放端口和数据库连接字符串：

```bash
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/my_user_db
```

说明：
- `PORT`：服务监听的端口
- `MONGODB_URI`：MongoDB 连接地址，可以是本地，也可以是 MongoDB Atlas 云地址

## 3.2 `src/config/db.js`：数据库连接

```js
// 📂 src/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB 连接成功: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ 连接错误: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

这一层只负责“连数据库”，不做任何业务逻辑，入口文件只需要调用一次 `connectDB()` 即可。

---

# 四、模型层：设计用户数据结构

## 4.1 `src/models/User.js`

```js
// 📂 src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '用户名是必填项'],
    unique: true
  },
  email: {
    type: String,
    required: [true, '邮箱是必填项'],
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
```

这里你可以看到典型的 Mongoose 用法：
- `new mongoose.Schema()` 定义数据结构
- `required / unique` 做基础约束
- `default` 指定默认值
- `mongoose.model('User', userSchema)` 生成可操作的模型对象

---

# 五、控制器层：编写业务逻辑

控制器只关心“如何处理请求、如何组织返回”，不关心 URL 细节（由路由层负责）。

## 5.1 `src/controllers/userController.js`

```js
// 📂 src/controllers/userController.js
const User = require('../models/User');

// GET /api/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, error: '服务器内部错误' });
  }
};

// POST /api/users
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
```

这里可以对照 Flask 中的“视图函数”：
- 接收 `req`（请求）对象，从中获取数据
- 调用模型方法如 `User.find()`、`User.create()`
- 用 `res.status().json()` 返回结构化结果

---

# 六、路由层：URL 与控制器的映射

## 6.1 `src/routes/userRoutes.js`

```js
// 📂 src/routes/userRoutes.js
const express = require('express');
const router = express.Router();

const { getUsers, createUser } = require('../controllers/userController');

router
  .route('/')
  .get(getUsers)
  .post(createUser);

module.exports = router;
```

这一层像“交通指挥官”，只负责：
- 收到 `/api/users` 开头的请求
- 按 HTTP 方法（GET / POST）分发到对应的控制器函数

---

# 七、入口层：组装应用并启动服务

## 7.1 `src/app.js`

```js
// 📂 src/app.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在端口 ${PORT}`);
});
```

对照 MVC：
- Model：`models/User.js`
- View：这里是纯后端 API，没有前端模板，可以理解为“JSON 视图”
- Controller：`controllers/userController.js`
- Router / App：`routes/userRoutes.js` 与 `app.js`

---

# 八、运行与接口测试

1. 启动 MongoDB 服务（本地或云端）
2. 在项目根目录执行：

```bash
npm run dev
```

若终端输出类似：

```bash
🚀 服务器运行在端口 3000
✅ MongoDB 连接成功: 127.0.0.1
```

说明服务与数据库都已正常工作。

3. 使用 Postman / Apifox / Thunder Client 测试接口

- 创建用户（POST）
  - URL：`http://localhost:3000/api/users`
  - Method：`POST`
  - Body（JSON）：

    ```json
    {
      "username": "GeminiUser",
      "email": "gemini@example.com"
    }
    ```

- 获取用户列表（GET）
  - URL：`http://localhost:3000/api/users`
  - Method：`GET`

---

# 九、总结与延伸方向

通过这个小项目，你可以把 Node.js 后端开发的关键环节串起来：

- 分层思想：配置层、模型层、控制器层、路由层、入口层各司其职
- 环境变量：敏感信息（数据库地址、账号密码）放在 `.env`，不写死在代码里
- 异步编程：数据库操作都是异步的，搭配 `async/await` 与 `try/catch` 做错误处理

在此基础上，你可以尝试进一步扩展：
- 添加「更新用户」「删除用户」接口，熟悉 RESTful 四大动词（GET/POST/PUT/DELETE）
- 给用户增加密码字段，引入加密与登录认证（如 `bcrypt` + JWT）
- 增加分页查询、模糊搜索等进阶查询功能

和 Python 小节一样，这里也是一个“专业后端项目的最小雏形”，熟悉之后再去看更复杂的微服务、网关、消息队列就会轻松很多。

