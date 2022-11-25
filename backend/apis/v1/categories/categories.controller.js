const category_model = require('./categories.model')
const mongoose = require('mongoose')
const errorModel = require('../err/error.model');

const addCategory = async (req, res) => {
    try {
        let {
          category_name,
          category_color,
          special_category,
        } = req.body
        let image = req.file.path
        let obj = {
            category_name,
            category_color,
            special_category,
            category_image: image,     
        }
        for (let [key, value] of Object.entries(obj)) {
            if (!value || value == '') {
                res.json({
                    status: 0,
                    remarks: `${key} : is required`
                })
            }
        }
        if (category_name && category_name != '') {
            let query = { category_name: category_name };
            let isAlreadyExist = await category_model.findOne(query);
            if (isAlreadyExist) {
                return res.json({
                    status: 0,
                    remarks: "Category Already Exist",
                })
            }
        }
    
         let category = await new category_model(obj)
         await category.save()
        if (category) {
            res.json({
                status: 1,
                  remarks: 'Category Added Successfully'
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
const getCategory = async (req, res) => {
    try {
        let result = await category_model.find();
        if (result) {
            res.json({
                status: 1,
                remarks: "Ok",
                data: result
            })
        }
    } catch (err) {
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
    addCategory: addCategory,
    getCategory: getCategory,
}