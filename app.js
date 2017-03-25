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
