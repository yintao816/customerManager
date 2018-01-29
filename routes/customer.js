var express = require('express');
var router = express.Router();
var url = require('url');
var Customer = require('../model/customer');

// 获取客户信息列表界面
router.get('/', function (req, res, next) {
    res.render('customers');
});

// 获取添加客户界面
router.get('/add', function (req, res, next) {
    res.render('addcustomer');
});

// 添加客户
router.post('/add', function (req, res) {
    console.log(req.body);
    var customer = new Customer({
        nativeplace: req.body.nativeplace,
        company: req.body.company,
        contacts: req.body.contacts
    });

    customer.save(function (err, cus, numAffected) {
        if (err) {
            res.send({status: 0, message: '添加客户失败！'});
        } else {
            res.send({status: 1, message: 'success!'});
        }
    });
});

// 删除客户
router.post('/del', function (req, res) {
    if (req.body.ids.length > 0) {
        var condition = {_id: {$in: req.body.ids.split(',')}}
        console.log(condition);
        Customer.remove(condition, function (err) {
            if (err) {
                res.send({status: 0, message: 'failure！'})
            } else {
                res.send({status: 1, message: 'success！'})
            }
        });
    } else {
        res.send({status: 0, message: 'id不能为空！'})
    }
});

// 获取客户信息
router.get('/all', function (req, res) {
    var keyword = url.parse(req.url, true).query.keyword;
    if (!keyword) {
        // 查询所有
        Customer.find(function (err, result) {
            if (err) {
                res.send({status: 0, message: '没有客户信息！'})
            } else {
                res.send({status: 1, message: 'success！', data: result});
            }
        });
    } else {
        var reg = new RegExp(keyword); //不区分大小写
        Customer.find(
            {
                $or: [ //多条件，数组
                    {company: {$regex: reg}},
                    {contacts: {$regex: reg}}
                ]
            }, function (err, result) {
                if (err) {
                    res.send({status: 0, message: '没有客户信息！'})
                } else {
                    res.send({status: 1, message: 'success！', data: result});
                }
            });
    }
});

module.exports = router;