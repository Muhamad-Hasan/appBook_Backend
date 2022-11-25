var mongoose = require('mongoose');
const NotificationModel = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users'
    },
    title:String,
    body:String,
    screen:String,
    creationDate: {
        type: Date,
        default: Date.now
    },
    other_user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    },
    open : {
        type : Boolean,
        default: false
    },
    booking_id : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'appointment'
    },
    business_id : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'business'
    },
    from_user_name :String,
    from_user_id : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    },


},
{collection:'notifications'},

)
module.exports=mongoose.model("notifications",NotificationModel);