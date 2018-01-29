var express = require('express');
var router = express.Router();

/* 加载登陆界面 */
router.get('/', function (req, res, next) {
    res.render('adminLogin');
});

module.exports = router;
