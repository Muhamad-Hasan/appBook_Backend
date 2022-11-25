'use strict';

let express = require('express');
let router = express.Router();
let chatCtrl = require('./chats.controller');
let auth = require('../../../middlewares/auth.midddleware');
var uploadS3 = require('../../../services/multer.service');

let setBucketPath = (req, res, next) => {
    req.bucketName = 'chats';
    return next();
}



// :: Prefix Path --- '/api/v1/chat'

router.post('/upload', auth.validate, setBucketPath, uploadS3.any(), chatCtrl.chatUploads);
router.get('/getAllMessages', auth.validate, chatCtrl.getAllMessages);
router.get('/all-users/messages', auth.validate, chatCtrl.getAllUsersChatList);


module.exports = router;