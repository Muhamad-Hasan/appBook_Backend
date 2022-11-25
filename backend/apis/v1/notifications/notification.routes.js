'use strict';

let express = require('express');
let router = express.Router();
let notificationCtrl = require('./notification.controller');
let auth = require('../../../middlewares/auth.midddleware');

// :: Prefix Path --- '/api/v1/notification' 

router.get('/all', auth.validate, notificationCtrl.fetchUserWise);
router.get('/chat', auth.validate, notificationCtrl.chatNotifications);

router.post('/save',notificationCtrl.save);
router.delete('/remove', auth.validate, notificationCtrl.deleteNotification);
router.get('/view', auth.validate, notificationCtrl.view_notification);

module.exports = router;