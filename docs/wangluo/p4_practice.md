# 实战练习：你的第一个 API

看书百遍，不如手敲一遍。本章节为你设计了两个极简的实战任务，帮助你跨出后端开发的第一步。

## 任务一：Python Flask "Hello World"

1. 在电脑上新建一个文件夹 `my-flask-app`。
2. 打开 VS Code 并在该文件夹下新建文件 `app.py`。
3. 输入以下代码：

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return {"message": "你好，这是我的第一个 Python API！"}

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

4. 在终端运行：`python app.py`。
5. 打开浏览器访问 `http://127.0.0.1:5000`，看到 JSON 数据就算成功！

---

## 任务二：Node.js Express 快速启动

1. 新建文件夹 `my-express-app`。
2. 终端执行：`npm init -y` (初始化项目)。
3. 终端执行：`npm install express` (安装框架)。
4. 新建文件 `index.js`，输入代码：

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: "Hello! 这是 Node.js 返回的数据。" });
});

app.listen(3000, () => {
  console.log('服务已在 http://localhost:3000 启动');
});
```

5. 终端运行：`node index.js`。
6. 访问 `http://localhost:3000`。

---

## 📚 后端必备小知识

在写代码之前，有几个名词你必须混个眼熟：

### 1. JSON (数据的“通用语言”)
后端返回给前端的数据通常长这样：
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "张三"
  }
}
```
它就像一个大字典，用键值对来存储信息。

### 2. HTTP 状态码 (服务器的“表情包”)
- **200 OK**: 一切正常！
- **400 Bad Request**: 前端传的参数有问题（比如没填用户名）。
- **401 Unauthorized**: 没登录，不能看。
- **404 Not Found**: 你访问的路径不存在。
- **500 Internal Server Error**: 你的后端代码写挂了（报错了）。

### 3. GET vs POST
- **GET**: 像“查字典”，从服务器拿数据。
- **POST**: 像“寄信”，往服务器送数据（比如注册账号）。

---

## 🏗️ 综合实战：简易留言板

我们将实现一个简单的 API，允许用户查看留言和发布留言。

### 方案 A：使用 Python Flask 实现

```python
# 📂 message_board.py
from flask import Flask, request, jsonify

app = Flask(__name__)

# 模拟数据库，存储在内存中
messages = [
    {"id": 1, "user": "学长", "content": "欢迎来到云麓谷！"}
]

# 1. 获取所有留言
@app.route('/messages', methods=['GET'])
def get_messages():
    return jsonify(messages)

# 2. 发布新留言
@app.route('/messages', methods=['POST'])
def add_message():
    data = request.json
    new_msg = {
        "id": len(messages) + 1,
        "user": data.get('user', '匿名用户'),
        "content": data.get('content', '')
    }
    messages.append(new_msg)
    return jsonify({"status": "success", "data": new_msg}), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

### 方案 B：使用 Node.js Express 实现

```javascript
// 📂 server.js
const express = require('express');
const app = express();

// 【核心步骤】必须添加这行，否则无法解析前端发来的 JSON 数据
// 它相当于一个“翻译官”，把前端发来的字节流翻译成 JavaScript 对象
app.use(express.json());

// 模拟数据库，存储在内存中（重启服务后数据会消失）
let messages = [
  { id: 1, user: "学姐", content: "后端开发很有趣哦！" }
];

// 1. 获取留言 (GET 请求)
app.get('/messages', (req, res) => {
  // res.json 会自动设置 Content-Type: application/json
  res.json(messages);
});

// 2. 发布留言 (POST 请求)
app.post('/messages', (req, res) => {
  // req.body 就是前端通过 POST 发送过来的 JSON 数据
  const newMsg = {
    id: messages.length + 1,
    user: req.body.user || '匿名用户',
    content: req.body.content || ''
  };
  messages.push(newMsg);
  // 返回 201 Created 状态码，表示资源创建成功
  res.status(201).json({ status: "success", data: newMsg });
});

app.listen(3000, () => {
  console.log('留言板服务已在 http://localhost:3000 启动');
});
```

---

## 🛠️ 如何测试你的接口？

写完代码后，不要只用浏览器访问。浏览器地址栏默认只能发送 `GET` 请求。

1. **使用 Apifox (推荐)**：
   - **GET 测试**：
     - 新建接口，方法选 `GET`，URL 输入 `http://localhost:5000/messages` (Flask) 或 `http://localhost:3000/messages` (Express)。
     - 点击“发送”，你应该能看到初始的那条留言。
   - **POST 测试**：
     - 新建接口，方法选 `POST`，URL 输入同上。
     - 在 **修改界面** 的 **Body** 标签页中，选择 **json**。
     - 输入测试数据：
       ```json
       {
         "user": "小白",
         "content": "打卡！我是新来的后端萌新。"
       }
       ```
     - 点击“发送”，如果返回 `status: success`，说明你成功写出了人生中第一个能存储数据的接口！

2. **观察结果**：
   - 再次运行 `GET` 请求，你会发现刚才发的那条留言已经出现在列表里了。这就是“状态存储”——后端的魅力所在。

## 🛡️ 后端开发“避坑”指南

1. **端口冲突**: 如果看到 `EADDRINUSE` 报错，说明端口（如 3000）被占用了。关掉之前的终端或者换个端口。
2. **拼写错误**: `res.json` 写成 `res.Json` 是新手最常犯的错。
3. **环境变量**: 永远记得在安装 Python 时勾选 "Add to PATH"。
4. **不要怕报错**: 报错信息是后端开发者最好的朋友，它会告诉你哪一行出错了。

::: info 学习资源推荐
- [MDN Web 文档 (HTTP 部分)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP)
- [菜鸟教程 (Python/Node.js)](https://www.runoob.com/)
- [Bilibili 搜索“后端入门”](https://www.bilibili.com/)
:::
