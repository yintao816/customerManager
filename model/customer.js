var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
    // 籍贯
    nativeplace: {type: String},
    // 公司
    company: {type: String},
    // 联系人
    contacts: {type: String}
})

module.exports = mongoose.model('customer', CustomerSchema);