const ReportModel = require('./report.model')
const mongoose = require('mongoose')
const errorModel = require('../err/error.model');
const Joi = require('@hapi/joi');

const addReport = async (req, res) => {
    let data = req.body;
    const schema = Joi.object({
        business_id : Joi.string().required(),
       
        description: Joi.string(),
        image: Joi.string()
    })

    try {

        let value = await schema.validateAsync(data);
        if(!value.error){
            data["image"] = req.file.path;
            data["user_id"] = req.user._id;
            let report  = new ReportModel(data);
            report.save();
            return res.status(200).json({
                status : 1,
                remarks :"Bussiness has been Successfully reported",
                data : report
            })
        }
        
    } catch (err) {
        let err_obj = {
            usr_id: req.user._id,
            error_name: err,
            api_name: '/category/addCategory'
        }
        const error_add = new errorModel(err_obj)
        await error_add.save();
        res.json({
            status: 0,
            remarks: err + 'Error'
        })
    }

}
const getReport = async (req, res) => {
    let data = req.query;
    const schema = Joi.object({
        id : Joi.string().required(),
        report_by:Joi.string().valid("user" , "business").required()
    })
    try {
        let value = await schema.validateAsync(data);
        if(!value.error){
            if(data.report_by == "user"){
                let reports = await ReportModel.find({user_id : data.id}).populate("user_id").populate("business_id");
                console.log("resports" , reports);
                if(reports){
                    res.status(200).json({
                        status:1,
                        data : reports,
                        remarks : "Reports by user"
                    })
                }
            }else{
                let reports = await ReportModel.find({business_id :data.id}).populate("user_id").populate("business_id");
                console.log("resports" , reports);
                if(reports){
                    res.status(200).json({
                        status:1,
                        data : reports,
                        remarks : "Reports by business"
                    })
                }
            }
        }
        
    } catch (err) {
        console.log("err" , err);
        let obj = {
            usr_id: req.user._id,
            error_name: err,
            api_name: '/business/getCategory'
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
    addReport: addReport,
    getReport: getReport,
}