var mongoose = require('mongoose');

const user_audit = new mongoose.Schema({
    usr_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    audit_token: String,
    login_status:Number,
    audit_date:Date,
    login_time:String,
  
})

module.exports=mongoose.model("user_audit",user_audit)