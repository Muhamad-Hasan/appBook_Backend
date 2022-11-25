'use strict';

let express = require('express');

let router = express();
let userRoutes = require('../apis/v1/user/user.route');
let businessRoutes = require('../apis/v1/business/business.route')
let servicessRoute = require('../apis/v1/services/services.route')
let appointmentRoute = require('../apis/v1/appointment/appointment.route')
let reviewRoute = require('../apis/v1/reviews/reviews.route')
let cardRoute = require('../apis/v1/card/card.route')
let categoryRoute = require('../apis/v1/categories/categories.route')
const paymentRoute = require('../apis/v1/payment/payment.route')
const notification = require("../apis/v1/notifications/notification.routes")
const chatRoute = require("../apis/v1/chat/chat.routes");
const reportRoute = require("../apis/v1/report/resport.route")
router.use('/user', userRoutes);
router.use('/business',businessRoutes)
router.use('/servicess',servicessRoute)
router.use('/appointment',appointmentRoute)
router.use('/review',reviewRoute)
router.use('/card',cardRoute)
router.use('/category',categoryRoute)
router.use('/payment' , paymentRoute)
router.use("/chat" , chatRoute)
router.use("/notification" , notification)
router.use("/report" , reportRoute)


module.exports = router;