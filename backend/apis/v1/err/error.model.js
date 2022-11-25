var mongoose = require('mongoose');

const err = new mongoose.Schema({
    usr_id: {
        type:mongoose.SchemaTypes.ObjectId,
        ref:'users',
    },
    error_name: String,
    api_name: String
})

module.exports = mongoose.model('error',err)