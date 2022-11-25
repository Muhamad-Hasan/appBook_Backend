const express = require('express')
const route = express();
const appoi = require('./appointment.controller')
const auth = require('../../../middlewares/auth.midddleware')

route.post('/addappointment',auth.validate,appoi.addAppointment)
route.post('/deleteappointment',auth.validate,appoi.deleteAppointment)
route.post('/appointments_byuser',auth.validate,appoi.Appointments_byuser)
route.post('/appointments_bybusiness' , auth.validate,appoi.Appointments_bybusiness)
route.post('/update_appointment',auth.validate ,appoi.update_AppointmentStatus)
route.get('/:id',auth.validate,appoi.appointment_byId)


module.exports = route;