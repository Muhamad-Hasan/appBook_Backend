const express = require('express')
const route = express();
const reviewCtrl  = require('../reviews/reviews.controller')
const auth = require('../../../middlewares/auth.midddleware')

route.post('/addreview',auth.validate,reviewCtrl.addReviews)
route.get('/getreview',reviewCtrl.getReviews)

module.exports = route;