const express = require('express')
const route = express.Router();
const auth = require('../../../middlewares/auth.midddleware')
const cardCtrl = require('./card.controller')
route.post('/addcard',auth.validate,cardCtrl.addCard)
route.post('/deletecard',auth.validate,cardCtrl.deletecard)
route.post('/getcardby_user',auth.validate,cardCtrl.getcardby_user)

module.exports = route;
