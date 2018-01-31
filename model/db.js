/**
 * mongoose官方说明文档
 * http://mongoosejs.com/docs/connections.html#use-mongo-client
 *
 *启动mongodb服务
 * brew services start mongodb  ---启动

 brew services stop mongodb --停止

 brew services restart mongodb --重启
 *
 * */

var mongoose = require('mongoose');
var Customer = require('../model/customer');

var dburl = 'mongodb://localhost:27017/customer_manager';

/**
 * 连接数据库
 * */
function dbconnect(){
    mongoose.Promise = global.Promise;
    mongoose.connect(dburl,{useMongoClient:true},function (err) {
        if(err){
            console.log("数据库连接失败：" + err);
        }else{
            console.log('数据库连接成功');
        }
    });
};

/**
 * 连接断开
 **/
mongoose.connection.on('disconnected', function () {
   console.log('Mongoose connection disconnected');
});

module.exports.dbconnect = dbconnect;

module.exports.addtestdata = function () {
    // var tempdata = [];
    // for (var i = 400000; i<600000; i ++) {
    //     var customer = new Customer({
    //         nativeplace: '湖北武汉',
    //         company: '散哒几号放假看老大时空裂缝记得环',
    //         contacts: '我是第' + i + '条数据'
    //     });
    //     tempdata.push(customer);
    //
    //     // customer.save(function (err, cus, numAffected) {
    //     //     if (err) {
    //     //         console.log(err)
    //     //     }
    //     // });
    // }
    // console.log(tempdata.length);
    //
    // Customer.insertMany(tempdata)
    //     .then(function(docs) {
    //         // do something with docs
    //         // console.log(docs);
    //     })
    //     .catch(function(err) {
    //         // error handling here
    //         console.log(err);
    //     });
}
