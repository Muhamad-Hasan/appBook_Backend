const mongoose = require('mongoose');

const services = mongoose.Schema({
    usr_id:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'users',
        required:[true,'User Id Required']
    },
    business_id:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'business',
        required:[true,'Business Id Required']
    },
    business_name:{
        type:mongoose.SchemaTypes.String,
        ref:'business',
        required:[true,'Business Name Required']
    },
    business_employees:[{
        employee_name:String
    }],
    service_name:String,
    service_duration:Number,
    service_image:String,
    service_description:String,
    services_charges:String,
    user_count : {
        type : Number,
        default : 1
    }
})

module.exports = mongoose.model('services',services)