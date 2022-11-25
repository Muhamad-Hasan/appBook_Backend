const express = require('express')
let router = express.Router();
let authValidate = require('../../../middlewares/auth.midddleware')
let categoryctrl = require('./categories.controller')
let upload = require('../../../services/multer.service');

router.post('/addCategory', upload.single('image'), authValidate.validate, categoryctrl.addCategory)
router.get('/getCategory', authValidate.validate, categoryctrl.getCategory)
module.exports = router;