const express = require('express')
const route = express();
const businessCtrl = require('./services.controller')
const auth = require('../../../middlewares/auth.midddleware')
const upload = require('../../../services/multer.service')

route.post('/addservices',auth.validate,upload.single('image'),businessCtrl.addservices)
route.post('/deleteservices',auth.validate,businessCtrl.deleteservices)
route.post('/servicesbyid',auth.validate,businessCtrl.getservicesbyid)
route.post('/servicesbybusiness',auth.validate,businessCtrl.getservicesbybusiness)

route.put('/updateService/:id' ,auth.validate ,businessCtrl.updateService)
module.exports = route;