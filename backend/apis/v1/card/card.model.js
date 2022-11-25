const mongoose = require('mongoose')

const cardModel = mongoose.Schema({
    usr_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users',
        required: [true, 'User Id is required']
    },
    card_method:{
        type:String,
        enum:['PayPal','ApplePay','Stripe','AddBank','CreditCard']
    },
    card_name: String,
    card_number: Number,
    card_cvv2: Number,
    card_expirydate : Date
})

module.exports = mongoose.model('card',cardModel)