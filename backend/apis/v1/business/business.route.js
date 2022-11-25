const express = require('express')
let router = express.Router();
let authValidate = require('../../../middlewares/auth.midddleware')
let businessCtrl = require('./business.controller')
let upload = require('../../../services/multer.service');

router.post('/addbusiness',  authValidate.validate, businessCtrl.addBusiness)
router.post('/updatebusiness',  authValidate.validate, businessCtrl.updateBusiness)
router.post('/deletebusiness', authValidate.validate, businessCtrl.deleteBusiness)
router.post('/getfaqs', authValidate.validate, businessCtrl.getfaqs)
router.post('/getBusiness', authValidate.validate, businessCtrl.getBusiness)
router.post('/addfav', authValidate.validate, businessCtrl.addfav)
router.get('/getfav', authValidate.validate, businessCtrl.getfav)
router.get('/search_business_name',  businessCtrl.search_business_name)
router.get('/search_business',  businessCtrl.search_business)
router.post('/available_slots' , businessCtrl.availableSlots)
router.post('/business_range' , businessCtrl.buisness_range) 
router.post('/finance' , businessCtrl.finance) 

module.exports = router;