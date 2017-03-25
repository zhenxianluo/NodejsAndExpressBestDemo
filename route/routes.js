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
