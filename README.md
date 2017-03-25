## 教程名：简单的基于express + nodejs的项目构建全览

> 一步一步构建整个项目，并对步骤详细说明，和部分使用技巧，设计开发、数据交互、测试、上传代码库等知识点

#### 克隆本仓库代码到本地并运行
> 正常运行条件: 已经成功安装`git、nodejs、npm、mongodb`
1. 克隆远程仓库到本地: `git clone https://github.com/zhenxianluo/NodejsAndExpressBestDemo.git`
2. 进入项目目录: `cd NodejsAndExpressBestDemo`
3. 安装依赖: `npm install`
4. 安装全局依赖: `sudo npm install -g supervisor;sudo npm install -g mocha;`
5. 启动数据库: `/etc/init.d/mongodb start`
6. 可选,测试: 'npm test'
7. 启动服务: `npm start`
8. 浏览器输入`127.0.0.1:3000`便可以看到本页内容

#### 前提说明
> 技术：nodejs + express + mongodb + npm + pugjs + mocha + chai + git  

    //目录结构
    ├── app.js          //服务器主程序及路由
    ├── package.json    //包配置文件
    ├── bin
    │   └── www         //服务器启动的入口
    ├── public
    │   └── js          //放置网页上执行的js脚本
    │       ├── app.js
    │       └── jquery.min.js
    ├── models
    │   └── models.js   //配置数据库的存储结构
    ├── route
    │   └── routes.js   //路由的配置文件
    ├── test
    │   └── app.test.js   //用于测试注册和登录接口
    └── views             //存放路由文件
        ├── header.pug
        ├── index.pug
        ├── login.pug
        ├── post.pug
        └── register.pug

#### 正式开始
1. 创建并进入目录：`mkdir note-nodejs & cd note-nodejs & touch package.json`
2. 复制下列{}引起来的代码到package.json,并执行`npm insatll`安装依赖
    ```
    //package.json文件讲解
    {
      "//": "项目名称",
      "name": "det-dev-nodejs-server",
      "//": "版本",
      "version": "1.0.0",
      "//": "描述",
      "description": "detail development dev nodejs server",
      "//": "项目入口文件",
      "main": "app.js",
      "//": "存放npm命令，`npm key`执行value命令",
      "scripts": {
      "start": "supervisor app.js"
      },
      "author": "zhenxianluo",
      "//": "开源类型",
      "license": "ISC",
      "//": "存放项目使用的模块，用于命令`npm install`安装",
      "dependencies": {
        "body-parser": "^1.17.1",
        "chai": "^3.5.0",
        "connect-mongo": "^1.3.2",
        "express": "^4.15.2",
        "express-session": "^1.15.1",
        "jstransformer-markdown-it": "^2.0.0",
        "chai-http": "^3.0.0",
        "mongoose": "^4.9.0",
        "path": "^0.12.7",
        "pug": "^2.0.0-beta11"
      }
    }
    //补充说明：
    supervisor app.js //启动服务器，并监控文件更改自动重启服务器
    //需要全局安装模块:
    1. mocha: 用于测试代码。
       sudo npm install -g mocha
    2. supervisor: 当文件发生变化后重启服务器。 
       sudo npm install -g supervisor
    //增加测试模块后需要改成：
    "scripts": {
      "test": "mocha -t 1000",
      "start": "node bin/www"
    }
    ```
3. 创建主要的文件及目录并编辑app.js文件:`touch app.js & mkdir models views route & vim app.js`
    ```js
    //写入下面代码到app.js, 然后node app.js或者npm start运行, 然后在浏览器输入127.0.0.1:3000就可以看到效果了，这是最简单的express应用
    var express = require('express');
    var app = express();
    app.set('port', 3000);
    app.get('/', function(req, res){
      return res.send('哈哈，服务器运行成功！')
    });
    app.listen(app.get('port'), function(req, res){
      console.log('app is runing at prot ' + app.get('port'));
    });
    ```
4. 向app.js加入基础的依赖和配置
- **app.js**
  ```js
  //引入必备模块
  var path = require('path');
  var bodyParser = require('body-parser');
  var crypto = require('crypto');
  var pug = require('pug');
  var express = require('express');
  //实例化express程序
  var app = express();
  
  //此时app是个程序对象，它有好多属性，其中有些特殊属性('views', 'view engine', 'port', ...)，配置他们可以达到特殊效果
  //设置服务器的默认视图文件，其中`__dirname`是全局变量表示当前目录路径，此时`path.json(__dirname, 'views')`指向`./views/`
  app.set('views', path.join(__dirname, 'views'));
  //设置应用默认使用的模板引擎，本例使用pug(原来的jade)模板引擎
  app.set('view engine', 'pug');
  //使用express唯一的内置中间件指定服务器向外公开的目录，目录下的文件可通过`127.0.0.1:3000/public/xxx.jpg`获取
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  
  //本应用的所有路由放在此文件夹下
  var routes = require('./route/routes');
  routes(app);
  var port = 3000;
  app.set('port', port);
  app.listen(port, function(req, res){
    console.log('app is runing at prot ' + port);
  });
  ```
- **route/routes.js**
  ```js
  var express = require('express');
  module.exports = function(app){
    app.get('/', function(req, res){
    //渲染index.pug文件,设置变量title值
    res.render('index', {
      title: "基础教程"
    });
    }); 
  }
  ```
- **views/header.pug**
  ```pug
  doctype html
  html
    head
    title= title
    script
      include ../public/js/jquery.min.js
      include ../public/js/app.js
    body
    block header
    block content
  ```
- **view/index.pug**
  ```pug
  //- 继承header.pug,并代入header.pug中的block
  extends header.pug
  block header
    p #{title}
  block content
    include:markdown-it ../README.md
  ```
- 现在打开浏览器输入127.0.0.1:3000便可以看到本内容。

#### 进入正题，务必同时 阅读+敲代码+思考

5. 配置mongodb数据库
- **models/models.js**
  ```js
  // 引入 mongoose 
  var mongoose = require('mongoose');
  // 使用 mongoose 连接服务,user是数据库名
  mongoose.connect('mongodb://localhost:27017/user');
  mongoose.connection.on('error', console.error.bind(console, '连接数据库失败'));
  //建立数据结构体
  var userSchema = mongoose.Schema({
    createTime: {type: Date, default: Date.now},
    username: String,
    password: String,
    email: String
  });
  //user是表名，将表user的数据结构定义成manSchema的结构，并赋值给可操作的Userd对象
  exports.User = mongoose.model('user', userSchema);
  ```
6. 接下来输入的将是文件的完整代码。
- 通过bower安装jquery
> 安装bower：sudo npm install -g bower  
> 安装jquery：bower install jquery  
> 然后提取jquery.min.js文件放入public/js/中，如果有jquery文件可直接放入，略过前两步。
- **views/header.pug**
  ```js
  doctype html
  html
    head
      meta(charset="utf-8")
      title= title
      script
        include ../public/js/jquery.min.js
        include ../public/js/app.js
    body
      if user
        div Hello
          a(href='/')= user.username
        div
          a(href='/quit') 退出
      else
        if page == 'login'
          div
            a(href='/register') 注册
        else if page == 'register' 
          div
            a(href='/login') 登录
        else
          div
            a(href='/register') 注册
          div
            a(href='/login') 登录
      block header
      block content
  ```
- **views/index.pug**
  ```js
  extends header.pug
  block header
    p #{title}
  block content
    include:markdown-it ../README.md
  ```
- **views/login.pug**
  ```js
  extends header.pug
  block header
    p= title
  block content
    input.username(type="text" name="username" placeholder="用户名")
    input.passwd(type="password" name="password" placeholder="密码")
    button.login= title
    .tip(style={color: 'red'})
  ```
- **views/register.pug**
  ```js
  extends header.pug
  block header
    p= title
  block content
    input.username(type="text" name="username" placeholder="用户名")
    input.password(type="password" name="password" placeholder="请输入密码")
    input.passwordagain(type="password" name="password" placeholder="请>再次输入密码") 
    button.register= title
    .tip(style={color: 'red'})
  ```
- **public/js/app.js**
  ```js
  $(function(){
    $('.login').on('click', function(event){
      if($('.username').val() == '' || $('.password').val() == '')
        $('.tip').text('用户名或密码不能为空');
      $.post('/login', {username: $('.username').val(), password: $('.password').val()}, function(res){
        if(res.status == 'error'){
          $('.tip').text(res.msg);
        }else if(res.status == 'success'){
          $('.tip').text(res.msg + ' 3秒后跳转');
          setTimeout(function(){
            window.location.href = '/';
          }, 3000);
        }
      }, 'json');
    });
    $('.register').on('click', function(event){
      if($('.username').val() == '' || $('.password').val() == '' || $('.passwordagain').val() == '')
        $('.tip').text('用户名或密码不能为空');
      if($('.username').val() != $('.usernameagain').val())
        $('.tip').text('两次密码输入不一致');
      $.ajax({
        type: 'POST',
        url: '/register',
        dataType: 'json',
        data: {
          username: $('.username').val(),
          password: $('.password').val()
        },
        success: function(res){
          if(res.status == 'error'){
            $('.tip').text(res.msg);
          }else if(res.status == 'success'){
            $('.tip').text(res.msg + '3秒后跳转');
            setTimeout(function(){
              window.location.href = '/login';
            }, 3000);
          }
        }
      });
    });
  });
  ```
- **app.js**
  ```js
  var path = require('path');
  var bodyParser = require('body-parser');
  var crypto = require('crypto');
  var pug = require('pug');
  var express = require('express');
  var session = require('express-session');
  //实例化express程序
  var app = express();
  
  //此时app是个程序对象，它有好多属性，其中有些特殊属性('views', 'view engine', 'port', ...)，配置他们可以达到特殊效果
  //设置服务器的默认视图文件，其中`__dirname`是全局变量表示当前目录路径，此时`path.json(__dirname, 'views')`指向`./views/`
  app.set('views', path.join(__dirname, 'views'));
  //设置应用默认使用的模板引擎，本例使用pug(原来的jade)模板引擎
  app.set('view engine', 'pug');
  //使用express唯一的内置中间件指定服务器向外公开的目录，目录下的文件可通过`127.0.0.1:3000/public/xxx.jpg`获取
  app.use(express.static(path.join(__dirname, 'public')));
  //解析请求体用的，比如req.body
  app.use(bodyParser.json({limit: '1mb'}));
  app.use(bodyParser.urlencoded({extended: false}));
  //设置session用于保持登录状态
  app.use(session({
    secret: 'keyboard cat',
    cookie: {maxAge: 24 * 60 * 60 * 1000},
    resave: true,
    saveUninitialized: true
  }));
  
  //本应用的所有路由放在此文件夹下
  var routes = require('./route/routes');
  routes(app);
  module.exports = app;
  ```
> app的启动代码抽取出来，此时app.js里向外提供的app可以用于测试。
- **bin/www**
  ```js
  var app = require('../app.js');
  
  var port = 3000;
  app.set('port', port);
  app.listen(port, function(req, res){
    console.log('app is runing at prot ' + port);
  });
  ```
- **route/routes.pug**
  ```js
  var express = require('express');
  //用于创建md5加密字符串
  var crypto = require('crypto');
  var models = require('../models/models.js')
  var User = models.User;
  module.exports = function(app){
    app.get('/', function(req, res){
      res.render('index', {
        title: '基础教程',
        page: 'index',
        user: req.session.user
      });
    });
    app.get('/quit', function(req, res){
      req.session.user = '';
      res.redirect('/');
    })
    app.get('/login', function(req, res){
      res.render('login', {
        title: '登录',
        page: 'login',
        user: req.session.user
      });
    });
    app.post('/login', function(req, res){
      User.findOne({username: req.body.username}, function(err, user){
        if(err){
          console.log(err);
          return res.redirect('/login');
        }
        //生成密码加密后的字符串
        var md5password = crypto.createHash('md5').update(req.body.password).digest('hex');
        if(user){
          console.log('登录成功');
          if(user.password == md5password){
            //登录成功后保存session会话
            req.session.user = user;
            return res.json({
              status: 'success',
              msg: '登录成功！'
            });
          }else{
            return res.json({
              status: 'error',
              msg: '密码错误'
            });
          }
        }else return res.json({
          status: 'error',
          msg:'帐号未注册'
        });
      });
    });
    app.get('/register', function(req, res){
      res.render('register', {
        title: '注册',
        page: 'register',
        user: req.session.user
      });
    });
    app.post('/register', function(req, res){
      User.findOne({username: req.body.username}, function(err, user){
        if(err){
          console.log(err);
          return res.redirect('/reg');
        }
        if(user){
          console.log("注册失败，用户已存在");
          return res.json({
            status: 'error',
            msg: '用户名已经存在'
          });
        }
        var md5password = crypto.createHash('md5').update(req.body.password).digest('hex');
        var newUser = new User({
          username: req.body.username,
          password: md5password
        });
        newUser.save(function(err, doc){
          if(err){
            console.log(err);
            return res.json({
              status: 'error',
              msg: '内部错误'
            });
          }
          console.log('注册成功');
          return res.json({
            status: 'success',
            msg: '注册成功！'
          });
        });
      });
    });
  }
  ```
7. 注册和登录接口测试
- **test/app.test.js**
  ```js
  //引入chai和chai-http模块
  var chai = require('chai');
  var chaiHttp = require('chai-http');
  //引入服务入口模块
  var server = require('../app');
  //引入chai的should和expect
  var should = chai.should();
  var expect = chai.expect;
  //用于建立http请求
  chai.use(chaiHttp);
  
  var data = {'username': 'ahahaha', 'password': 'ohehehe'};
  describe('测试api', function(){
    it('测试注册接口，每次测试需要更改username', function(done){
      chai.request(server)
      .post('/register')
        .send(data)
      .end(function(err, res){
        //网络请求的状态码应该是200
        res.should.have.status(200);
        //断言返回值不能为空
        expect(res).to.be.not.empty;
        //断言返回的json数据中的status值为success
        expect(res.body.status).to.be.equal('success');
        done();
      });
    });
    it('测试登录接口', function(done){
      chai.request(server)
      .post('/login')
        .send(data)
      .end(function(err, res){
        res.should.have.status(200);
        expect(res).to.be.not.empty;
        expect(res.body.status).to.be.equal('success');
        done();
      });
    });
  });
  ```
8. 项目文件上传到github代码库
	1. 初始化: `git init`
	2. 添加远程库: `git remote add origin https://github.com/zhenxianluo/NodejsAndExpressBestDemo.git`
	3. 创建过滤规则文件: `touch .gitignore & echo node_modules/ > .gitignore`
	4. 添加更改到本地库: `git add .`
	5. 提交到本地代码库: `git commit -m "NodejsAndExpressBestDemo"`
	6. 提交到github代码库: `git push -u origin master`

#### 说明与支持
假如你是想入门或只懂点皮毛的初学者，请亲手跟着代码敲三遍。注意学习的同时用心思考为什么和怎么做更好，相信你能在学完本教程后学到很多或者入门nodejs后端开发，同时欢迎与我交流技术。如有任何问题或建议请在issues下提问，笔者看到会马上回复的。

请笔者吃个棒棒糖 | 请笔者喝杯奶茶
---------------- | -------------
![](./second/twormb.jpg) | ![](./second/fivermb.jpg)
### 感谢支持！
