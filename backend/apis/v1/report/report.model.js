var mongoose = require('mongoose');

const report = new mongoose.Schema({
    user_id: {
        type:mongoose.SchemaTypes.ObjectId,
        ref:'users',
    },
    business_id: {
        type:mongoose.SchemaTypes.ObjectId,
        ref:'business',
    },
    image: String,
    description: String
})

module.exports = mongoose.model('report',report)