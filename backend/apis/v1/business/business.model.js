const mongoose = require('mongoose');

const business = new mongoose.Schema({

    usr_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users',
        required: [true, 'User Id is required']
    },
    business_avatar: String,
    business_name: String,
    business_tagline: String,
    email: String,
    mobile: Number,
    location: String,
    country: String,
    city: String,
    gender:{
        type:String,
        enum:['Male','Female', 'Both']
    },
    postal_code: String,
    latitude:Number,
    longitude:Number,
    loc :{
        "type":  [
            Number
           ] ,
           index: '2d'
        // "coordinates": [
        //  Number
        // ] // [<longitude>, <latitude>]
       
    }, 
    Stars: {
        type: Number,
        default: 0,
    },
    service_count: {
        type: Number,
        default: 0,
    },
    experience_level: {
        type : Number
    },
    qualifications : {
        type : Array
    },
    years_established : {
        type : Number
    },
    staff: {
        type :Number
    },
    branches: {
        type : Number
    },
    speciality_area : {
        type : Array
    },
    revenue: {
        type : Number,
        default:0
    }

})

const business_detail = mongoose.Schema({
    usr_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users',
        required: [true, 'User Id required']

    },
    business_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'business',
        required: [true, 'Business Id required']
    },
    business_category: String,
    business_description: String,
    business_photos: [
        {
            type: String
        }
    ]
})

const business_timings = mongoose.Schema({
    usr_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users',
        required: [true, 'User Id required']
    },
    business_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'business',
        required: [true, 'Business Id required']
    },
    monday:
    {
        mon_active: Boolean,
        mon_from: String,
        mon_to: String
    },
    tuesday:
    {
        tues_active: Boolean,
        tues_from: String,
        tues_to: String
    },
    wednessday:
    {
        wed_active: Boolean,
        wed_from: String,
        wed_to: String
    },
    thursday:
    {
        thurs_active: Boolean,
        thurs_from: String,
        thurs_to: String
    },
    friday:
    {
        fri_active: Boolean,
        fri_from: String,
        fri_to: String
    },
    saturday:
    {
        sat_active: Boolean,
        sat_from: String,
        sat_to: String
    },
    sunday:
    {
        sun_active: Boolean,
        sun_from: String,
        sun_to: String
    },
})

const business_faqs = mongoose.Schema({
    usr_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users',
        required: [true, 'User Id required']
    },
    business_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'business',
        required: [true, 'Business Id required']
    },
    faqs_text: [{
        ques_text: String,
        ans_text: String
    }],
})
const business_bridge_schema = mongoose.Schema({
    usr_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users',
        required: [true, 'User Id required']

    },
    business_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'business',
        required: [true, 'Business_id Id required']

    },
    businessDetail_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'business_detail',
        required: [true, 'business_detail Id required']

    },
    timings_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'business_timings',
        required: [true, 'Timing is required']

    },
    businessFaq_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'business_faqs',
        required: [true, 'Faq is required']

    },
})
const favorite = mongoose.Schema({
    usr_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users',
        required: [true, 'User Id required']

    },
    business_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'business',
        required: [true, 'Business_id Id required']
    },
})

var businesModel = mongoose.model('business', business)
var detailModel = mongoose.model('business_detail', business_detail)
var timingsModel = mongoose.model('business_timings', business_timings)
var faqsModel = mongoose.model('business_faqs', business_faqs)
var bridgeModel = mongoose.model('bridgeModel', business_bridge_schema)
var favoriteModel = mongoose.model('favorite', favorite)

// businesModel.CreateIndex({ "loc" : "2dsphere" })

module.exports = {
    businesModel: businesModel,
    detailModel: detailModel,
    timingsModel: timingsModel,
    faqsModel: faqsModel,
    bridgeModel: bridgeModel,
    favoriteModel: favoriteModel,
}