const servicesModel = require('./services.model');
const { businesModel } = require('../business/business.model')
const errorModel = require('../err/error.model')
let fs = require('fs');
const Joi = require('@hapi/joi');

const addservices = async (req, res) => {
    try {
        let {
            service_name,
            service_duration,
            service_description,
            services_charges,
            busines_id,
            user_count
            // business_employees
        } = req.body
        // let image = req.file.path
        service_description ? service_description : ""
        let obj = {
            service_name,
            service_duration,
            // service_image: image,
            service_description,
            user_count,
            services_charges,
            busines_id,
            // business_employees: JSON.parse(business_employees)
        }
        for (let [key, value] of Object.entries(obj)) {
            if (key != 'service_description') {
                if (!value || value == '') {
                    res.json({
                        status: 0,
                        remarks: `${key} : is required`
                    })
                }
            }
        }
        if (service_name && service_name != '') {
            let query = { service_name: service_name };
            let isAlreadyExist = await servicesModel.findOne(query);
            if (isAlreadyExist) {
                return res.json({
                    status: 0,
                    remarks: "Service Is Already Exist",
                })
            }
        }
        let business = await businesModel.findOne({ _id: busines_id })
        if (business) {
            let count = 0;
            obj = Object.assign({ usr_id: req.user._id, business_id: business._id, business_name: business.business_name }, obj)
            let servicess = await new servicesModel(obj)
            await servicess.save()
            count = await servicesModel.countDocuments({ business_id: business._id })
            await businesModel.findByIdAndUpdate({ _id: busines_id }, { service_count: count })
            if (servicess) {
                res.json({
                    status: 1,
                    remarks: 'Services Added Successfully'
                })
            }
        }
    } catch (err) {
        let err_obj = {
            usr_id: req.user._id,
            error_name: err,
            api_name: '/services/addservices'
        }
        const error_add = new errorModel(err_obj)
        await error_add.save();
        res.json({
            ststus: 0,
            remarks: err + 'Error'
        })
    }

}

const getservicesbyid = async (req, res) => {
    try {
        let {
            id
        } = req.query;

        let result = await servicesModel.findOne({ _id: id })

        res.json({
            status: 1,
            remarks: "Ok",
            data: result
        })


    } catch (err) {
        let err_obj = {
            usr_id: req.user._id,
            error_name: err,
            api_name: '/services/servicesbyid'
        }
        const error_add = new errorModel(err_obj)
        await error_add.save();
        res.json({
            ststus: 0,
            remarks: err + 'Error'
        })
    }

}

const getservicesbybusiness = async (req, res) => {
    try {
        let {
            id
        } = req.query;

        let result = await servicesModel.find({ business_id: id })

        res.json({
            status: 1,
            remarks: "Ok",
            data: result
        })


    } catch (err) {
        let err_obj = {
            usr_id: req.user._id,
            error_name: err,
            api_name: '/services/servicesbybusiness'
        }
        const error_add = new errorModel(err_obj)
        await error_add.save();
        res.json({
            ststus: 0,
            remarks: err + 'Error'
        })
    }

}

const deleteservices = async (req, res) => {
    try {
        let { id } = req.query
        console.log(id);
        let result = await servicesModel.findOne({ _id: id })
        console.log("result", result);
        if (result) {
            if (result.service_image) {
                await fs.unlinkSync(result.service_image);
            }

            await servicesModel.deleteOne({ _id: result._id });
            res.json({
                status: 1,
                remarks: 'Service Remove Successfully'
            })
        }
    } catch (err) {
        console.log("err", err);
        let obj = {
            usr_id: req.user._id,
            error_name: err,
            api_name: '/servicess/deleteservices'
        }
        const error_add = new errorModel(obj)
        await error_add.save();
        res.json({
            ststus: 0,
            remarks: err + ' Unexpected Error .....'
        })
    }
}


const updateService = async (req, res) => {
    const data = req.body;
    const { id } = req.params;
    const schema = Joi.object({
        service_name: Joi.string(),
        service_duration: Joi.number(),
        service_description: Joi.string(),
        services_charges: Joi.string(),
        busines_id: Joi.string(),
        service_image: Joi.string(),
        user_count:Joi.number(),
    })
    try {
        // let value = await schema.validateAsync(data);
        // if (!value.error) {
        //     let service = await servicesModel.findByIdAndUpdate(id, {
        //         $set: data
        //     }, { new: true });
        //     if (service) {
        //         res.json({
        //             status: 1,
        //             remarks: "Service Updated Successfully",
        //             data: service
        //         })
        //     }
        // }
        let service = await servicesModel.findByIdAndUpdate(id, {
            $set: data
        }, { new: true });
        if (service) {
            res.json({
                status: 1,
                remarks: "Service Updated Successfully",
                data: service
            })
        }
    } catch (err) {
        return res.status(400).json(err);
    }
}
module.exports = {
    addservices: addservices,
    deleteservices: deleteservices,
    getservicesbyid: getservicesbyid,
    getservicesbybusiness: getservicesbybusiness,
    updateService: updateService
}
