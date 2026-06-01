# 数据库入门：数据存在哪里？

前面我们写的 API 都是把数据存在内存里（Python 的 list、JavaScript 的数组），服务器一重启数据就没了。在真实项目中，数据需要**持久化存储**——这就是数据库的工作。

::: tip 前置知识
建议先阅读 [RESTful API 设计指南](./p3_api_design) 了解 API 的基本概念。
:::

---

# 一、为什么需要数据库？

## 1.1 内存 vs 持久化存储

```
内存（RAM）                    数据库（硬盘）
┌──────────────┐              ┌──────────────┐
│ 服务器运行时  │              │  持久存储     │
│              │              │              │
│ data = [...] │  ──重启──►   │  data 消失了！│
│              │              │              │
└──────────────┘              └──────────────┘
 ❌ 数据丢失                    ✅ 数据保留
```

| 存储方式 | 速度 | 持久性 | 适用场景 |
|---------|------|--------|---------|
| **内存变量** | 极快 | ❌ 重启即丢失 | 临时缓存、开发测试 |
| **文件** | 中等 | ✅ 保留 | 配置文件、日志 |
| **数据库** | 快 | ✅ 保留 | 用户数据、业务数据 |

## 1.2 数据库能做什么？

- **持久存储**：数据保存在硬盘上，重启不丢失
- **高效查询**：百万条数据中快速找到你要的那一条
- **并发安全**：多人同时读写不会冲突
- **数据完整性**：保证数据格式正确、关系有效

---

# 二、SQL vs NoSQL

数据库主要分为两大阵营：

## 2.1 SQL（关系型数据库）

**代表**：MySQL、PostgreSQL、SQLite

数据以**表格**形式存储，表与表之间可以建立关系：

```
用户表 (users)                    订单表 (orders)
┌────┬──────┬─────┐              ┌────┬─────────┬────────┐
│ id │ name │ age │              │ id │ user_id │ amount │
├────┼──────┼─────┤              ├────┼─────────┼────────┤
│ 1  │ 张三 │ 20  │              │ 1  │ 1       │ 99.00  │
│ 2  │ 李四 │ 22  │              │ 2  │ 1       │ 199.00 │
└────┴──────┴─────┘              │ 3  │ 2       │ 59.00  │
                                 └────┴─────────┴────────┘
        ↑                               ↑
        └──── 通过 user_id 关联 ─────────┘
```

查询示例：
```sql
-- 查找张三的所有订单
SELECT * FROM orders WHERE user_id = 1;
```

## 2.2 NoSQL（非关系型数据库）

**代表**：MongoDB、Redis

数据以 **JSON 风格的文档** 存储，结构灵活：

```json
{
  "_id": "65a1b2c3d4e5",
  "name": "张三",
  "age": 20,
  "orders": [
    { "amount": 99.00, "date": "2026-01-01" },
    { "amount": 199.00, "date": "2026-01-05" }
  ]
}
```

## 2.3 对比

| 特性 | SQL | NoSQL |
|------|-----|-------|
| **数据结构** | 固定表结构（Schema） | 灵活文档结构 |
| **查询语言** | SQL 语句 | 各有各的查询方式 |
| **关系处理** | 擅长多表关联 | 适合嵌套/非结构化数据 |
| **扩展方式** | 垂直扩展（更强的机器） | 水平扩展（更多机器） |
| **学习曲线** | 需要学 SQL 语法 | JSON 格式，对新手更友好 |
| **适用场景** | 电商、金融、ERP | 内容管理、实时应用、日志 |

::: tip 该选哪个？
- 数据之间有复杂关系（如用户→订单→商品） → **SQL**
- 数据结构不固定或经常变化 → **NoSQL**
- 刚入门，想快速上手 → **MongoDB（NoSQL）** 更容易起步
:::

---

# 三、MongoDB 核心概念

MongoDB 是最流行的 NoSQL 数据库，也是 [Node.js Express 教程](./p3_nodejs) 中使用的数据库。

## 3.1 层级关系

```
数据库 (Database)
  └── 集合 (Collection)      ← 类似 SQL 的"表"
        └── 文档 (Document)  ← 类似 SQL 的"行"
```

| SQL 概念 | MongoDB 概念 | 说明 |
|---------|-------------|------|
| 数据库 (Database) | 数据库 (Database) | 相同 |
| 表 (Table) | **集合 (Collection)** | 存放一组文档 |
| 行 (Row) | **文档 (Document)** | 一条数据记录 |
| 列 (Column) | **字段 (Field)** | 文档中的键值对 |
| 主键 (Primary Key) | **_id** | 每个文档自动生成的唯一 ID |

## 3.2 文档长什么样？

MongoDB 中的每条数据都是一个 JSON 风格的文档：

```json
{
  "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
  "name": "张三",
  "email": "zhangsan@example.com",
  "age": 20,
  "hobbies": ["编程", "篮球", "游戏"],
  "address": {
    "city": "长沙",
    "school": "中南大学"
  }
}
```

特点：
- 字段可以是任意类型（字符串、数字、数组、嵌套对象）
- 不同文档可以有不同的字段（灵活 Schema）
- `_id` 是自动生成的唯一标识

---

# 四、MongoDB 基本操作（CRUD）

CRUD 是数据库的四个基本操作：**C**reate（创建）、**R**ead（读取）、**U**pdate（更新）、**D**elete（删除）。

## 4.1 MongoDB Shell 命令

::: tip 提示
以下命令在 MongoDB Shell（`mongosh`）中执行。你也可以用 MongoDB Compass 的可视化界面操作。
:::

### Create — 创建

```javascript
// 插入一条文档
db.users.insertOne({
  name: "张三",
  age: 20,
  email: "zhangsan@example.com"
})

// 批量插入
db.users.insertMany([
  { name: "张三", age: 20 },
  { name: "李四", age: 22 },
  { name: "王五", age: 21 }
])
```

### Read — 读取

```javascript
// 查询所有文档
db.users.find()

// 条件查询
db.users.find({ age: 20 })

// 只返回一条
db.users.findOne({ name: "张三" })

// 比较查询
db.users.find({ age: { $gte: 20 } })   // age >= 20
db.users.find({ age: { $lt: 22 } })    // age < 22

// 只返回特定字段
db.users.find({}, { name: 1, age: 1 }) // 只返回 name 和 age
```

### Update — 更新

```javascript
// 更新一条文档
db.users.updateOne(
  { name: "张三" },           // 查询条件
  { $set: { age: 21 } }      // 更新内容
)

// 更新多条
db.users.updateMany(
  { age: { $lt: 21 } },      // age < 21 的所有文档
  { $set: { status: "young" } }
)
```

### Delete — 删除

```javascript
// 删除一条
db.users.deleteOne({ name: "张三" })

// 删除多条
db.users.deleteMany({ age: { $lt: 18 } })  // 删除所有 age < 18
```

## 4.2 常用查询操作符

| 操作符 | 含义 | 示例 |
|--------|------|------|
| `$eq` | 等于（默认） | `{ age: 20 }` |
| `$ne` | 不等于 | `{ age: { $ne: 20 } }` |
| `$gt` / `$gte` | 大于 / 大于等于 | `{ age: { $gt: 18 } }` |
| `$lt` / `$lte` | 小于 / 小于等于 | `{ age: { $lt: 25 } }` |
| `$in` | 在列表中 | `{ name: { $in: ["张三", "李四"] } }` |
| `$and` | 且 | `{ $and: [{ age: { $gt: 18 } }, { name: "张三" }] }` |
| `$or` | 或 | `{ $or: [{ name: "张三" }, { name: "李四" }] }` |

---

# 五、MongoDB Compass：可视化操作

MongoDB Compass 是一个图形界面工具，让你不用写命令就能操作数据库。

## 5.1 连接数据库

1. 打开 MongoDB Compass
2. 连接地址默认是 `mongodb://localhost:27017`
3. 点击 **Connect**

## 5.2 常用操作

| 操作 | 步骤 |
|------|------|
| **查看所有数据库** | 左侧面板列出所有数据库 |
| **查看集合** | 点击数据库名，展开集合列表 |
| **查看文档** | 点击集合名，右侧显示所有文档 |
| **添加文档** | 点击 "Add Data" → "Insert Document" |
| **编辑文档** | 点击文档旁的编辑图标 |
| **删除文档** | 勾选文档 → 点击 "Delete" |
| **查询** | 顶部输入框输入 JSON 查询条件 |

::: info Compass 的好处
对于新手来说，Compass 最大的好处是**所见即所得**。你不用记 MongoDB 命令，用鼠标点点就能完成大部分操作。而且它能直观地展示数据结构，帮你理解 JSON 文档的概念。
:::

---

# 六、Mongoose：在代码中操作 MongoDB

在 Node.js 项目中，我们通常用 **Mongoose** 来操作 MongoDB。它提供了 Schema（数据结构定义）和 Model（数据操作接口）。

## 6.1 安装

```bash
npm install mongoose
```

## 6.2 定义 Schema 和 Model

```javascript
const mongoose = require('mongoose');

// 定义数据结构（Schema）
const userSchema = new mongoose.Schema({
  name:  { type: String, required: true },        // 必填字符串
  email: { type: String, required: true, unique: true },  // 唯一
  age:   { type: Number, default: 0 },            // 默认值 0
  createdAt: { type: Date, default: Date.now }     // 默认当前时间
});

// 创建 Model（基于 Schema 创建的"类"）
const User = mongoose.model('User', userSchema);
```

## 6.3 用 Model 进行 CRUD

```javascript
// Create — 创建
const user = new User({ name: '张三', email: 'zhangsan@example.com' });
await user.save();

// 或者用 create 一步到位
await User.create({ name: '李四', email: 'lisi@example.com' });

// Read — 查询
const allUsers = await User.find();                    // 所有用户
const user = await User.findOne({ name: '张三' });    // 查一个
const user = await User.findById('65a1b2c3d4e5...');  // 按 ID 查

// Update — 更新
await User.updateOne({ name: '张三' }, { age: 21 });
// 或者（返回更新后的文档）
const updated = await User.findOneAndUpdate(
  { name: '张三' },
  { age: 21 },
  { new: true }  // 返回更新后的文档
);

// Delete — 删除
await User.deleteOne({ name: '张三' });
await User.deleteMany({ age: { $lt: 18 } });
```

::: warning await 关键字
所有 Mongoose 操作都是**异步**的（返回 Promise），必须用 `await` 等待结果，而且函数需要声明为 `async`。
:::

---

# 七、SQL 快速入门（了解即可）

虽然本培训主要使用 MongoDB，但了解 SQL 的基本语法对你会很有帮助。

## 7.1 基本 CRUD

```sql
-- Create：插入数据
INSERT INTO users (name, email, age) VALUES ('张三', 'zhangsan@example.com', 20);

-- Read：查询数据
SELECT * FROM users;                          -- 查询所有
SELECT name, age FROM users WHERE age > 18;   -- 条件查询
SELECT * FROM users ORDER BY age DESC;        -- 按年龄降序
SELECT * FROM users LIMIT 10 OFFSET 20;      -- 分页（第3页，每页10条）

-- Update：更新数据
UPDATE users SET age = 21 WHERE name = '张三';

-- Delete：删除数据
DELETE FROM users WHERE name = '张三';
```

## 7.2 MongoDB 与 SQL 操作对照

| 操作 | MongoDB | SQL |
|------|---------|-----|
| 查询所有 | `db.users.find()` | `SELECT * FROM users` |
| 条件查询 | `db.users.find({ age: 20 })` | `SELECT * FROM users WHERE age = 20` |
| 插入 | `db.users.insertOne({})` | `INSERT INTO users ...` |
| 更新 | `db.users.updateOne({}, { $set: {} })` | `UPDATE users SET ...` |
| 删除 | `db.users.deleteOne({})` | `DELETE FROM users WHERE ...` |

---

# 八、小结

| 概念 | 一句话解释 |
|------|-----------|
| **数据库** | 持久化存储数据的地方，重启不丢数据 |
| **SQL 数据库** | 表格结构，适合有固定关系的数据 |
| **NoSQL 数据库** | 文档结构，灵活，适合快速开发 |
| **MongoDB** | 最流行的 NoSQL 数据库，用 JSON 文档存储 |
| **CRUD** | Create/Read/Update/Delete，数据库四大操作 |
| **Mongoose** | Node.js 中操作 MongoDB 的工具库 |
| **Compass** | MongoDB 的图形化管理工具 |

::: tip 下一步
- 学习 [Node.js Express](./p3_nodejs) 了解如何在后端代码中使用 MongoDB
- 学习 [Flask](./p3_flask) 了解 Python 中使用数据库的方式
- 完成 [实战练习](./p4_practice) 中的留言板项目，尝试给它加上数据库
:::
