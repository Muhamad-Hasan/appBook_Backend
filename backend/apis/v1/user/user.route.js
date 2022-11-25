'use strict';

let express = require('express');
let userCtrl = require('./user.controller');
let auth = require('../../../middlewares/auth.midddleware');
let router = express.Router();
let update = require('../../../services/multer.service')
let authValidate = require('../../../middlewares/auth.midddleware')
// :: Prefix Path --- '/api/v1/user'
router.post('/register',update.single('avatar'), userCtrl.register);
router.post('/login',userCtrl.login);
router.get("/alluser" , userCtrl.allUser);
router.post("/forgetPassword" , userCtrl.forget_password);
router.post("/changePassword" , userCtrl.change_password);
router.post("/changeUserPassword" , userCtrl.change_user_password);
router.post("/updateProfile" ,update.single("avatar"), userCtrl.update_profile);
router.post("/social_auth" , userCtrl.social_login);
router.post("/check_user" , userCtrl.check_user);
router.post("/logout" ,auth.validate , userCtrl.logout);



module.exports = router;