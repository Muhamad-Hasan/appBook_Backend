const express = require('express')
const route = express();
const paymentCtrl  = require('../payment/payment.controller')
const auth = require('../../../middlewares/auth.midddleware')

route.post('/addCard',auth.validate , paymentCtrl.addCard)
route.get('/allCard',auth.validate , paymentCtrl.getAllCard)
route.post('/deleteCard',auth.validate , paymentCtrl.deleteUserCard)




module.exports = route;