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
    var relevantuser = req.body.relevantuser;
    if (!relevantuser || typeof relevantuser === 'undefine') {
        res.send({status: 0, message: '参数错误！'});
        return
    }
    console.log(req.body);
    var customer = new Customer({
        nativeplace: req.body.nativeplace,
        company: req.body.company,
        contacts: req.body.contacts,
        relevantuser: relevantuser
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
    var _id = url.parse(req.url, true).query._id;
    var relevantuser = url.parse(req.url, true).query.relevantuser;
    var isnext = Boolean(url.parse(req.url, true).query.isnext);

    if (!relevantuser || typeof relevantuser === 'undefine') {
        res.send({status: 0, message: '参数错误！'});
        return
    }

    if (!keyword || typeof keyword === 'undefine') {
        console.log('查询所有');
        if (!_id) {
            Customer.find({'relevantuser': relevantuser}, function (err, result) {
                if (err) {
                    res.send({status: 0, message: '没有客户信息！'})
                } else {
                    dealresult(result, res, {});
                }
            }).limit(20);
        } else {
            var condition = isnext == true ? {_id: {$gt: _id}} : {_id: {$lt: _id}};
            condition['relevantuser'] = relevantuser;
            Customer.find(condition, function (err, result) {
                if (err) {
                    res.send({status: 0, message: '没有客户信息！'})
                } else {
                    dealresult(result, res, {});
                }
            }).limit(20);
        }
    } else {
        console.log('条件查询');
        var reg = new RegExp(keyword); //不区分大小写
        var condition = {
            $or: [ //多条件，数组
                {company: {$regex: reg}},
                {contacts: {$regex: reg}}
            ],
            'relevantuser': relevantuser
        }
        Customer.find(condition, function (err, result) {
            if (err) {
                res.send({status: 0, message: '没有客户信息！'})
            } else {
                dealresult(result, res, condition);
            }
        }).limit(20);
    }
});

function dealresult(result, res, condition) {
    Customer.count(condition, function (err, count) {
        res.send({
            status: 1,
            message: 'success！',
            data: result,
            pagecount: Math.ceil(count / 20)
        });
    });
}

module.exports = router;