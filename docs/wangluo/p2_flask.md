::: info
Flask 是一个轻量级的 Python Web 框架，以简洁、灵活和易于扩展为特点，被广泛用于快速开发 Web 应用程序。以下是关于 Flask 的详细介绍：
:::

### **核心特点**
1. **轻量级与简洁**  
   Flask 被称为“微框架”（micro-framework），核心功能仅包含路由、模板引擎（Jinja2）、请求/响应处理等基础组件，没有内置 ORM、表单验证等复杂功能，让开发者可以按需选择工具，避免过度封装带来的冗余。

2. **灵活可扩展**  
   虽然核心简单，但通过丰富的扩展库（如 `Flask-SQLAlchemy` 用于数据库操作、`Flask-Login` 处理用户认证等）可以轻松扩展功能，适应从简单 API 到复杂 Web 应用的需求。

3. **易学易用**  
   语法简洁直观，入门门槛低，适合新手快速上手。一个最简单的 Flask 应用只需几行代码即可运行。

4. **基于 Werkzeug 和 Jinja2**  
   - **Werkzeug**：处理底层的 HTTP 协议、路由匹配、请求/响应封装等。
   - **Jinja2**：强大的模板引擎，支持变量替换、条件判断、循环等，便于构建动态网页。


### **基本使用示例**
1. **安装**  
   使用 pip 安装：
   ```bash
   pip install flask
   ```

2. **最小应用**  
   创建一个简单的 Web 服务：
   ```python
   from flask import Flask

   app = Flask(__name__)  # 初始化 Flask 应用，__name__ 表示当前模块名

   @app.route('/')  # 路由装饰器，定义访问路径
   def hello_world():
       return 'Hello, Flask!'  # 返回响应内容

   if __name__ == '__main__':
       app.run(debug=True)  # 启动开发服务器，debug=True 开启调试模式
   ```
   运行后，访问 `http://127.0.0.1:5000` 即可看到 "Hello, Flask!"。


### **核心功能**
1. **路由与视图**  
   通过 `@app.route()` 装饰器定义 URL 路径与视图函数的映射，支持动态 URL 参数：
   ```python
   @app.route('/user/<username>')  # 动态参数 username
   def show_user(username):
       return f'User: {username}'
   ```

2. **请求与响应**  
   使用 `request` 对象获取请求数据（如表单、URL 参数），通过 `make_response` 或直接返回字符串/JSON 构建响应：
   ```python
   from flask import request, jsonify

   @app.route('/login', methods=['POST'])  # 支持 POST 方法
   def login():
       username = request.form.get('username')  # 获取表单数据
       return jsonify({'status': 'success', 'user': username})  # 返回 JSON
   ```

3. **模板渲染**  
   使用 `render_template` 加载 HTML 模板（默认存放在 `templates` 文件夹），结合 Jinja2 语法动态生成页面：
   ```python
   from flask import render_template

   @app.route('/hello/<name>')
   def hello(name):
       return render_template('hello.html', name=name)  # 传递变量到模板
   ```
   模板文件 `templates/hello.html`：
   ```html
   <h1>Hello, {{ name }}!</h1>  <!-- 变量替换 -->
   ```

4. **会话与 cookies**  
   通过 `session` 对象管理用户会话（需设置密钥），`make_response` 操作 cookies：
   ```python
   from flask import session, make_response

   app.secret_key = 'your_secret_key'  # 会话加密密钥

   @app.route('/set_session')
   def set_session():
       session['user'] = 'admin'  # 设置会话
       return 'Session set'

   @app.route('/set_cookie')
   def set_cookie():
       resp = make_response('Cookie set')
       resp.set_cookie('theme', 'dark')  # 设置 cookie
       return resp
   ```


### **常用扩展**
- `Flask-SQLAlchemy`：ORM 工具，简化数据库操作（支持 MySQL、PostgreSQL 等）。
- `Flask-Login`：处理用户登录、会话管理。
- `Flask-WTF`：表单验证与 CSRF 保护。
- `Flask-RESTful`/`Flask-RESTX`：快速构建 RESTful API。
- `Flask-Bootstrap`：集成 Bootstrap 前端框架。


### **适用场景**
- 快速开发小型 Web 应用或原型。
- 构建 RESTful API 服务。
- 需要高度定制化架构的项目（避免大型框架的约束）。
