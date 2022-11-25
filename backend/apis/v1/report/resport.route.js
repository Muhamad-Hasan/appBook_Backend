const express = require('express')
let router = express.Router();
let authValidate = require('../../../middlewares/auth.midddleware')
let reportctrl = require('./report.controller')
let upload = require('../../../services/multer.service');

router.post('/', upload.single('image'), authValidate.validate, reportctrl.addReport)
router.get('/', authValidate.validate, reportctrl.getReport)
module.exports = router;