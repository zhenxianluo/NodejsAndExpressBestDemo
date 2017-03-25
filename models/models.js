var mongoose = require('mongoose');
// 使用 mongoose 连接服务,human是数据库名
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
