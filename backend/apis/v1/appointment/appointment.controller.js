const appointmentModel = require('./appointment.model')
const errorModel = require('../err/error.model')
const serviceModel = require('../services/services.model')
const { businesModel, timingsModel } = require('../business/business.model')
const Pay = require("../../../services/stripe.services")
const userModel = require('../user/user.model')
let moment = require('moment');
const firebaseService = require("../../../services/firebase-notification.service")
const notificationModel = require("../../v1/notifications/notification.model");
const Joi = require("@hapi/joi");
// const businessModel = require('../business/business.model')

// const businessModel = require('../business/business.model')

const addAppointment = async (req, res) => {
    const data = req.body;
    const serviceSchema = Joi.object().keys({
        service_id: Joi.string().required(),
        service_name: Joi.string().required(),
        service_person_name: Joi.string().required(),
        date: Joi.string().required(),
        time: Joi.string().required(),
        service_charges: Joi.number().required(),
        service_description: Joi.string().allow(""),
        user_count : Joi.number(),
        duration : Joi.number()
    })
    const schema = Joi.object().keys({
        business_id: Joi.string().required(),
        service: Joi.array().required().items(serviceSchema),
        comment: Joi.string(),
        payment_mode: Joi.string().valid("Cash", "Card"),

        card_id: Joi.string().allow("")
    })
    try {
        let value = await schema.validateAsync(data);
        if (!value.error) {
            let {
                business_id,
                comment,
                payment_mode,

                card_id
            } = data;
            let description = ""
            let service = data.service;

            if (payment_mode == "Card" && !card_id) {
                return res.status(400).json({
                    status: 0,
                    remarks: "Card Id is Required"
                })
            }
            let err_transactrion = []
            let succeeded_transaction = [];
            let receipts = []
            if (payment_mode == "Cash") {
                succeeded_transaction = service
            }
            else {
                for (let item = 0; item < service.length; item++) {

                    description = description.length > 0 ? description + " , " + service[item].service_name : service[item].service_name
                    let checkPayment = await Pay.paymentTransfer(service[item].service_charges, description, req.user.stripeId, card_id);
                    console.log("check", checkPayment);
                    if (checkPayment.status == "succeeded") {
                        service[item]["payment_id"] = checkPayment.id
                        succeeded_transaction = [...succeeded_transaction, service[item]]
                        receipts = [...receipts, checkPayment.receipt_url]
                    } else {
                        err_transactrion = [...err_transactrion, checkPayment.raw && checkPayment.raw.message ? checkPayment.raw.message : ""]
                    }
                }
            }

            // service.forEach(async(item)=> {

            // })
            const user = await userModel.findOne({ _id: req.user._id })
            const business = await businesModel.findOne({ _id: business_id });
            console.log("bus", business, business_id);
            const business_user = await userModel.findOne({ _id: business.usr_id })
            console.log("checckPay,memt", succeeded_transaction.length);
            let booking_no = await appointmentModel.countDocuments()
            if (succeeded_transaction.length > 0) {
                let obj = {
                    usr_id: user._id,
                    usr_name: user.full_name,
                    service: succeeded_transaction,
                    business_id: business_id,
                    business_name: business.business_name,
                    comment: comment,
                    payment_mode: payment_mode,
                    // payment_id :checkPayment.id
                    booking_no: booking_no
                }
                let appointment = new appointmentModel(obj)
                appointment.save()
                console.log("firebase", business_user);
                if (business_user.device_token) {
                    console.log("firebase", business_user);
                    let notification_obj = {
                        title: 'Appointment',
                        body: `${user.full_name} requested a appointment on ${business.business_name}`,
                        screen: 'Appointment',
                        booking_id: appointment._id,
                        business_id: business_id

                    }
                    firebaseService.sendNotification(business_user.device_token, notification_obj);
                    let newNotification = new notificationModel(Object.assign(notification_obj, { userId: business_user._id }));
                    await newNotification.save();
                }


                res.json({
                    status: 1,
                    remarks: 'Appointment added succesfully',
                    payment_receipt: receipts,
                    appointment: appointment,
                    err_transactrion: err_transactrion
                })
            }
            else if (err_transactrion.length > 0) {
                res.status(400).json({
                    status: 0,
                    remarks: err_transactrion,
                })
            }
            else {
                res.status(400).json({
                    status: 0,
                    remarks: "Something went wrong",
                })
            }


        }


        // let obj = {
        //     _service_id,
        //     _person_id,
        //     _day
        // }
        // for (let [key, value] of Object.entries(obj)) {
        //     if (!value || value == '') {
        //         res.json({
        //             ststus: 0,
        //             remarks: `${key} : is required`
        //         })
        //     }
        // }
        // var _date = _day
        // _day = getDayName(_day, "en-us");

        // const _service = await serviceModel.findOne({ _id: _service_id })



        // if (_service) {

        //     var _person_name = _service.business_employees.filter(item => item._id == _person_id);
        //     let _business = await businesModel.findOne({ _id: _service.business_id })

        //     let _timing = await timingsModel.findOne({ business_id: _business._id })

        //     let _openshop = false;
        //     let _opentiming = '';
        //     let _closetiming = '';
        //     var _date_from = '';
        //     var _date_to = '';
        //     var _time = '';
        //     switch (_day) {
        //         case "Sunday":
        //             var _status = timing.sunday.sun_active
        //             if (_status == true) {
        //                 _openshop = true;
        //                 _opentiming = _timing.sunday.sun_from
        //                 _closetiming = _timing.sunday.sun_to
        //                 break;
        //             }
        //             break;
        //         case "Monday":
        //             var _status = _timing.monday.mon_active
        //             if (_status == true) {
        //                 _openshop = true;
        //                 _opentiming = _timing.monday.mon_from
        //                 _closetiming = _timing.monday.mon_to
        //                 break;
        //             }
        //             break;
        //         case "Tuesday":
        //             var _status = _timing.tuesday.tues_active
        //             if (_status == true) {
        //                 _openshop = true;
        //                 _opentiming = _timing.tuesday.tues_from
        //                 _closetiming = _timing.tuesday.tues_to
        //                 break;
        //             }
        //             break;
        //         case "Wednesday":
        //             var _status = _timing.wednessday.wed_active
        //             if (_status == true) {
        //                 _openshop = true;
        //                 _opentiming = _timing.wednessday.wed_from
        //                 _closetiming = _timing.wednessday.wed_to
        //                 break;
        //             }
        //             break;
        //         case "Thursday":
        //             var _status = _timing.thursday.thurs_active
        //             if (_status == true) {
        //                 _openshop = true;
        //                 _opentiming = _timing.thursday.thurs_from
        //                 _closetiming = _timing.thursday.thurs_to
        //                 break;
        //             }
        //             break;
        //         case "Friday":
        //             var _status = _timing.friday.fri_active
        //             if (_status == true) {
        //                 _openshop = true;
        //                 _opentiming = _timing.friday.fri_from
        //                 _closetiming = _timing.friday.fri_to
        //                 break;
        //             }
        //             break;
        //         case "Saturday":
        //             var _status = _timing.saturday.sat_active
        //             if (_status == true) {
        //                 _openshop = true;
        //                 _opentiming = _timing.saturday.sat_from
        //                 _closetiming = _timing.saturday.sat_to
        //                 break;
        //             }
        //             break;
        //     }
        //     if (_openshop == true) {
        //         let _result = await appointmentModel.find().and([
        //             {
        //                 service_id: _service_id
        //             },
        //             {
        //                 service_person_id: _person_id
        //             },
        //             {
        //                 date: _date
        //             }
        //         ]).sort({ date_to: 1 });


        //         if (_result != '') {

        //             _date_from = _result[_result.length - 1].date_to
        //             _date_to = moment(_date_from).add(_service.service_duration, 'm').toDate();
        //             _time = _date_to.getUTCHours() + ':' + _date_to.getUTCMinutes() + ':00'
        //             _closetiming = new Date(moment(_date + ' ' + _closetiming, 'YYYY-MM-DD HH:mm:ss.000+05:00').format('YYYY-MM-DD HH:mm:ss.000+00:00'))
        //             var same = _date_to.getTime() > _closetiming.getTime();
        //             if (same) {
        //                 res.json({
        //                     status: 1,
        //                     remarks: 'All Slot Reserved'
        //                 })
        //             } else {

        //                 deatil(req.user._id,user.full_name, _service._id, _service.service_name, _person_id, _person_name[0].employee_name, _business._id, _business.business_name, _date, _time, _date_from, _date_to)

        //                 res.json({
        //                     status: 1,
        //                     remarks: 'Appointment Added Successfully'
        //                 })
        //             }

        //         } else {

        //             _date_from = moment(_date + ' ' + _opentiming, 'YYYY-MM-DD HH:mm:ss.000+05:00').format('YYYY-MM-DD HH:mm:ss.000+00:00');
        //             _date_to = moment(_date_from).add(_service.service_duration, 'm').toDate();
        //             _time = _date_to.getUTCHours() + ':' + _date_to.getUTCMinutes() + ':00'
        //             deatil(req.user._id,user.full_name, _service._id, _service.service_name, _person_id, _person_name[0].employee_name, _business._id, _business.business_name, _date, _time, _date_from, _date_to)

        //             res.json({
        //                 status: 1,
        //                 remarks: 'Appointment Added Successfully'
        //             })
        //         }


        //     }
        //     else {
        //         res.json({
        //             status: 0,
        //             remarks: 'Today is shop closed'
        //         })
        //     }

        // } else {
        //     res.json({
        //         status: 1,
        //         remarks: 'Service ID is not valid'
        //     })
        // }

    } catch (err) {
        console.log(err);
        let obj = {
            usr_id: req.user._id,
            error_name: err,
            api_name: '/appointment/addappointment'
        }
        const error_add = new errorModel(obj)
        await error_add.save();
        res.status(400).json({
            status: 0,
            remarks: err + ' '
        })
    }
}

const Appointments_byuser = async (req, res) => {
    try {
        
        let {start , rows} = req.body;
        start ? start : 0;
        rows ? rows : 100;
        let data = [];
        let result = await (await appointmentModel.find({ usr_id: req.user._id }).sort({_id :-1}).skip(start).limit(rows).populate("business_id"))
        console.log("result", result);
        if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                if (result[i].service.length > 0) {
                    for (let j = 0; j < result[i].service.length; j++) {
                        let obj = {
                            result: result[i].service[j],
                            business_name: result[i].business_id,
                            payment_mode: result[i].payment_mode,
                            comment:result[i].comment,
                            // appointment_id : result._id
                        }
                        data.push(obj);
                    }
                }

            }
        }
        // else  {
        //     for (let j = 0; j < result.service.length; j++) {
        //         let obj = {
        //             result: result.service[j],
        //             business_name: result[i].business_id,
        //             payment_mode : result[i].payment_mode
        //         }
        //         data.push(obj);
        //     }
        // }
        if (result != '') {
            res.json({
                status: 1,
                remarks: "Ok",
                data: data,

            })
        } else {
            res.json({
                status: 1,
                remarks: "Don't have any appointments",
            })
        }

    } catch (err) {

        let obj = {
            usr_id: req.user._id,
            error_name: err,
            api_name: '/appointment/Appointments_byuser'
        }
        const error_add = new errorModel(obj)
        await error_add.save();
        res.json({
            status: 0,
            remarks: err + ' Unexpected Error .....'
        })
    }
}

const Appointments_bybusiness = async (req, res) => {
    try {
        let { id } = req.query;
        let {start , rows} = req.body
        start ? start : 0;
        rows ? rows : 100;
        let data = [];
        let business_user = await businesModel.find({ usr_id: id });
        let ids = [];
        business_user.forEach(business => {
            ids = [...ids, business._id]
        })
        console.log("ids", ids);
        // return res.status(200).json(business_user);
        let result = await appointmentModel.find({ business_id: { $in: ids } }).sort({_id :-1}).populate("usr_id", "avatar , full_name").populate("business_id")
        // return res.json(result)
        let services = {}
        if (result.length > 0) {
            result.forEach(item => {
                if (Object.keys(services).includes(item.business_id.business_name)) {
                    item.service.forEach(service => {
                        services[item.business_id.business_name] = [...services[item.business_id.business_name], {
                            usr_name: item.usr_id,
                            result: service,
                            payment_mode: item.payment_mode,
                            comment:item.comment,
                            business : item.business_id
                        }]
                    })
                } else {
                    item.service.forEach(service => {
                        services[item.business_id.business_name] = [{
                            usr_name: item.usr_id,
                            result: service,
                            payment_mode: item.payment_mode,
                            comment:item.comment,
                            business : item.business_id
                        }]
                    })
                }


            })
        }

        // if(result.length>1)
        // {
        //     for(let i=0; i<result.length; i++)
        //     {
        //         for(let j=0; j<result[i].service.length; j++)
        //         {
        //             let obj = {
        //                 result: result[i].service[j],
        //                 usr_name: result[i].usr_name
        //             }
        //             data.push(obj);
        //         }
        //     }
        // }
        // else {
        //     for (let j = 0; j < result.service.length; j++) {
        //         let obj = {
        //             result: result.service[j],
        //             usr_name: result.usr_name
        //         }
        //         data.push(obj);
        //     }
        // }
        if (result != '') {
            res.json({
                status: 1,
                remarks: "Ok",
                data: services
            })
        } else {
            res.json({
                status: 1,
                remarks: "Don't have any appointments",
            })
        }
    } catch (err) {
        let obj = {
            usr_id: req.user._id,
            error_name: err,
            api_name: '/appointment/Appointments_bybusiness'
        }
        const error_add = new errorModel(obj)
        await error_add.save();
        res.json({
            ststus: 0,
            remarks: err + ' Unexpected Error .....'
        })
    }
}

const deleteAppointment = async (req, res) => {
    try {
        let { id } = req.query;
        let appointment = await appointmentModel.findOne({ _id: id })
        if (appointment._id) {
            console.log(appointment)
            await appointmentModel.deleteOne({ _id: appointment._id })

            res.json({
                status: 1,
                remarks: 'Appointment Remove Successfully'
            })
        }
    } catch (err) {
        let obj = {
            usr_id: req.user._id,
            error_name: err,
            api_name: '/appointment/deleteappointment'
        }
        const error_add = new errorModel(obj)
        await error_add.save();
        res.json({
            ststus: 0,
            remarks: err + ' Unexpected Error .....'
        })
    }

}
const update_AppointmentStatus = async (req, res) => {
    try {
        let { id } = req.query;
        let { status } = req.body;
        let payment_status, service;
        let appointment = await appointmentModel.findOne({ "service._id": id })
        if (!appointment || appointment.service.length == 0) {
            return res.status(400).json({
                status: 0,
                remarks: "No Appointments Found"
            })
        }
        for (let i = 0; i < appointment.service.length; i++) {
            if (appointment.service[i].id == id) {
                service = appointment.service[i]
                appointment.service[i].status = status;
                req.body.cancel_description ? appointment.service[i].cancel_description = req.body.cancel_description : null;
                let updateappointment = await appointmentModel.findOneAndUpdate({ "service._id": id }, {
                    $set: appointment
                }, { new: true })
                console.log("updateappointment", updateappointment);
                if (status == "Accepted") {
                    payment_status = await Pay.captureAmount(service.service_charges, service.payment_id)


                } else if (status == "Cancelled") {
                    payment_status = "Your Request will be cancelled  ,Amount will Refund with in seven days";
                    let serviceData = await serviceModel.findOne({ _id: service.service_id });
                    console.log("cnacell", serviceData, id);
                    const service_user = await userModel.findOne({ _id: serviceData.usr_id });
                    console.log("appointment user", service_user);
                    if (service_user.device_token) {
                        console.log("log", service_user.device_token);
                        let notification_obj = {
                            title: 'Appointment',
                            body: `${service_user.full_name} ${status} Booking Request `,
                            screen: 'Appointment',
                            booking_id: service._id,
                            business_id: appointment.business_id
                           
                            
                        }
                        firebaseService.sendNotification(service_user.device_token, notification_obj);
                        let newNotification = new notificationModel(Object.assign(notification_obj, { userId: service_user._id }));
                        await newNotification.save();

                        return res.json({
                            status: 1,
                            remarks: "Appointment has been successfully Cancelled",
                            // data: service,
                            payment_status: payment_status
                        })
                    }
                } else if (status == "Completed") {
                    const appointment_user = await userModel.findOne({ _id: appointment.usr_id });
                    console.log("appointment user", appointment_user);
                    let busienss_detail = await businesModel.findOne({_id :appointment.business_id}).populate("usr_id");
                    
                    if (appointment_user.device_token) {
                        console.log("completed", appointment_user);
                        let notification_obj = {
                            title: 'Appointment',
                            body: `${service.service_name} has been ${status} successfully`,
                            screen: 'Appointment',
                            booking_id: service._id,
                            business_id: appointment.business_id,
                            business_name: busienss_detail.business_name,
                            business_avatar: busienss_detail.business_avatar,
                            business_user : busienss_detail.usr_id
                        }
                        firebaseService.sendNotification(appointment_user.device_token, notification_obj);
                        let newNotification = new notificationModel(Object.assign(notification_obj, { userId: service._id }));
                        await newNotification.save();

                        let business_update = await businesModel.findByIdAndUpdate(appointment.business_id, {
                            $inc: { revenue: service.service_charges }
                        }, { new: true });

                        return res.json({
                            status: 1,
                            remarks: "Appointment has been updated",
                            data: service,
                            payment_status: payment_status
                        })
                    }
                }
                else {
                    payment_status = "Amount will Refund with in seven days"
                }
                break;
            }
        }
        if (appointment && status != "Cancelled") {

            // console.log(appointment)
            //    await appointmentModel.deleteOne({ _id: appointment._id })
            let business_data = await businesModel.findById(appointment.business_id);
            const appointment_user = await userModel.findOne({ _id: appointment.usr_id });
            console.log("appointment user", appointment_user);
            if (appointment_user.device_token) {
                console.log("not cancel", appointment_user.device_token);
                let notification_obj = {
                    title: 'Appointment',
                    body: `${business_data.business_name} ${status} your request `,
                    screen: 'Appointment',
                    booking_id: service._id,
                    business_id: appointment.business_id
                }
                firebaseService.sendNotification(appointment_user.device_token, notification_obj);
                let newNotification = new notificationModel(Object.assign(notification_obj, { userId: appointment_user._id }));
                await newNotification.save();

                res.json({
                    status: 1,
                    remarks: "Appointment has been updated",
                    data: service,
                    payment_status: payment_status
                })
            }
            else {
                res.json({
                    status: 1,
                    remarks: 'No Appointments were found.',
                    // data: appointment
                })
            }
        }
    } catch (err) {
        console.log("err", err);
        let obj = {
            // usr_id: req.user._id,
            error_name: err,
            api_name: '/appointment/deleteappointment'
        }
        const error_add = new errorModel(obj)
        await error_add.save();
        res.json({
            ststus: 0,
            remarks: err + ' Unexpected Error .....'
        })
    }

}


function deatil(user_id, user_name, _service_id, _service_name, _person_id, _person_name, _business_id, _business_name, _date, _time, _date_from, _date_to) {
    let obj = {
        usr_id: user_id,
        usr_name: user_name,
        service_id: _service_id,
        service_name: _service_name,
        service_person_id: _person_id,
        service_person_name: _person_name,
        business_id: _business_id,
        business_name: _business_name,
        date: _date,
        time: _time,
        date_from: _date_from,
        date_to: _date_to
    }
    let appointment = new appointmentModel(obj)
    appointment.save()
}

function getDayName(dateStr, locale) {
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: 'long' });
}

const appointment_byId = async (req, res) => {
    const { id } = req.params;
    try {
        let appointment = await appointmentModel.findOne({ "service._id": id }).populate("business_id");
        console.log("ser", appointment, id);
        let service = appointment && appointment.service.filter(f => f._id == id)[0]

        if (appointment) {
            let obj = {
                result: service,
                business_name: appointment.business_id,
                payment_mode: appointment.payment_mode,
                comment:appointment.comment
                // appointment_id : result._id
            }
            res.status(200).json({
                status: 1,
                remarks: "Ok",
                data: obj
            })
        }
    } catch (err) {
        console.log("err", err);
        let obj = {
            // usr_id: req.user._id,
            error_name: err,
            api_name: '/appointment/:id'
        }
        const error_add = new errorModel(obj)
        await error_add.save();
        res.json({
            status: 0,
            remarks: err + ' Unexpected Error .....'
        })
    }
}

module.exports = {
    addAppointment: addAppointment,
    deleteAppointment: deleteAppointment,
    Appointments_byuser: Appointments_byuser,
    Appointments_bybusiness: Appointments_bybusiness,
    update_AppointmentStatus: update_AppointmentStatus,
    appointment_byId: appointment_byId

}