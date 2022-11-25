const mongoose = require('mongoose')

const appointmentModel = mongoose.Schema({
    usr_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users',
        required: [true, 'User ID Required']
    },
    usr_name: {
        type: mongoose.SchemaTypes.String,
        ref: 'users',
        required: [true, 'User Name Required']
    },
    service: [{
        service_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'services',
            required: [true, 'Service ID Required']
        },
        service_name: {
            type: mongoose.SchemaTypes.String,
            ref: 'services',
            required: [true, 'Services Name Required']
        },
        service_person_name: {
            type: String,
            // ref: 'services',
            required: [true, 'Person Name Required']
        },
        service_charges: {
            type: Number,
            // ref: 'services',
            required: [true, 'Person Name Required']
        },
        service_description: {
            type: String,
            // ref: 'services',
            // required: [true, 'Service  Description Required']
        },
        user_count:{
            type :Number,
            default:1 
        },
        duration : {
            type :Number,
            default:30
        },
     
        // usr_name: {
        //     type: mongoose.SchemaTypes.String,
        //     ref: 'users',
        //     required: [true, 'User Name Required']
        // },
        date:{
            type:String
        },
        time:{
            type:String
        },
        status: {
            type: String,
            enum: ['Accepted', 'Rejected', 'Pending' , "Cancelled" , "Completed"],
            default: 'Pending',
        },
        cancel_description : {
            type : String
        },
        payment_id : {
            type : String,
           
        }
    }],
    // service_id: {
    //     type: mongoose.SchemaTypes.ObjectId,
    //     ref: 'services',
    //     required: [true, 'Service ID Required']
    // },
    // service_name: {
    //     type: mongoose.SchemaTypes.String,
    //     ref: 'services',
    //     required: [true, 'Services Name Required']
    // },
    // service_person_id: {
    //     type: mongoose.SchemaTypes.ObjectId,
    //     ref: 'services',
    //     required: [true, 'Person Id Required']
    // },
    // service_person_name: {
    //     type: mongoose.SchemaTypes.String,
    //     ref: 'services',
    //     required: [true, 'Person Name Required']
    // },
    // service_person_name: {
    //     type: String,
    //     // ref: 'services',
    //     required: [true, 'Person Name Required']
    // },
    business_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'business',
        required: [true, 'Business Id Required']
    },
    business_name: {
        type: mongoose.SchemaTypes.String,
        ref: 'business',
        required: [true, 'Business Name Required']
    },
    // date:{
    //     type:Date
    // },
    // time:{
    //     type:String
    // },
    // date_from:{
    //     type:Date    
    // },  
    // date_to:{
    //     type:Date
    // }
    // ,
    
    payment_mode : {
        type: String,
        enum: ['Cash', 'Card'],
        default: 'Cash',
    },
    comment: {
        type: String,
    },
    booking_no : {
        type : Number,
        default : 0
    }
    // payment_id : {
    //     type: String,
    //     required : true
    // }
})

module.exports = mongoose.model('appointment',appointmentModel)