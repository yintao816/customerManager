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
