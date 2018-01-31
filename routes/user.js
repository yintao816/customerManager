var express = require('express');
var router = express.Router();
var Admin = require('../model/admin');

/* 管理员登陆. */
router.post('/login', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    if (username && password) {
        Admin.findOne({'username': username}, function (err, result) {
            // res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
            if (err || result == null) {
                res.send({statue: 0, message: '用户不存在'});
            } else {
                console.log(result);
                if (result.password == password) {
                    res.send({statue: 1, message: '登录成功', data: result});
                } else {
                    res.send({statue: 0, message: '密码不正确'});
                }
            }
        });

    } else {
        res.end('请输入用户名和密码');
    }
});


module.exports = router;
