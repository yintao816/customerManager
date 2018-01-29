/**
 *  mongodb 命令
 *  http://www.yiibai.com/mongodb/mongodb_insert_document.html
 * */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AdminSchema = new Schema({
    username: {type: String},
    password: {type: String},
    lastlogin: {type: String}
})

module.exports = mongoose.model('admin_user', AdminSchema);