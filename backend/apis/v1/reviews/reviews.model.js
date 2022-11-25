const mongoose = require('mongoose')

const reviewModel = mongoose.Schema({
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
    avatar: {
        type: mongoose.SchemaTypes.String,
        ref: 'users',
        required: [true, 'Avatar Required']
    },
    reviews: String,
    Stars : Number,
    creationDate: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('reviews',reviewModel)