var express = require('express');
var router = express.Router();
var url = require('url');
var sd = require('silly-datetime');

var Admin = require('../model/admin')

router.get('/', function (req, res, next) {
    var arg = url.parse(req.url,true).query;

    if (typeof arg.username !== undefined || arg.username !== null || arg.username !== '') {
        Admin.findOne({'username': arg.username}, function (err, rest) {
            var updates = {$set: {lastlogin: sd.format(new Date().toLocaleString(), 'YYYY-MM-DD HH:mm:ss')}};
            var condition = {_id: rest._id};
            Admin.update(condition, updates, function (err, result) { });

            if (err || rest.lastlogin == null) {
                res.render('home',{username: arg.username, lastlogin: '首次登陆'});
            }else {
                console.log('上次登录时间：' + rest.lastlogin)
                res.render('home',{username: arg.username, lastlogin: '您上次登录时间：' + rest.lastlogin});
            }
        });
    }else {
        res.render('home',{username: '未知用户'});
    }
});

module.exports = router;
