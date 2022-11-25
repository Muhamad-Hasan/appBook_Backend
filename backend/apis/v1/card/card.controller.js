const cardModel = require('./card.model')
const errorModel = require('../err/error.model')
const { find } = require('./card.model')

const addCard = async (req, res) => {
    try {
        let {
            card_name,
            card_number,
            card_cvv2,
            card_expirydate,
            card_method } = req.body

        let obj = {
            usr_id: req.user._id,
            card_name,
            card_number,
            card_cvv2,
            card_expirydate,
            card_method
        }

        for (let [key, value] of Object.entries(obj)) {
            if (!value || value == '') {
                res.json({
                    status: 0,
                    remarks: `${key} : is required`
                })
            }
        }

        let result = await cardModel.findOne({ card_number: card_number })

        if (!result) {
            let card =  new cardModel(obj)
            await card.save();
            if (card) {
                res.json({
                    status: 1,
                    remarks: 'Card Added Sucessfully'
                })
            }
        } else {

            res.json({
                status: 0,
                remarks: 'Card Already Exist'
            })
        }

    } catch (err) {
        let obj = {
            usr_id: req.user._id,
            error_name: err,
            api_name: '/card/addcard'
        }
        const error_add = new errorModel(obj)
        await error_add.save();
        res.json({
            status: 0,
            remarks: err + ' Unexpected Error .....'
        })
    }
}

const deletecard = async (req, res) => {
    try {
        let { id } = req.query
        let result = await cardModel.findOne({ _id: id })
        if (result) {
            await cardModel.deleteOne({ _id: id })
            res.json({
                status: 1,
                remarks: 'Record Deleted Successfully '
            })
        }
        res.json({
            status: 0,
            remarks: 'Invalid ID'
        })

    } catch (err) {
        let obj = {
            usr_id: req.user._id,
            error_name: err,
            api_name: '/card/deletecard'
        }
        const error_add = new errorModel(obj)
        await error_add.save();
        res.json({
            status: 0,
            remarks: err + ' Unexpected Error .....'
        })
    }
}

const getcardby_user = async (req, res) => {
    try {
        let { user_id } = req.query
        let result = await cardModel.find({ usr_id: user_id })
        if (result != '') {
            res.json({
                status: 1,
                remarks: "Ok",
                data: result
            })
        }
        res.json({
            status: 0,
            remarks: "Don't have any card",
        })

    } catch (err) {
        let obj = {
            usr_id: req.user._id,
            error_name: err,
            api_name: '/card/getcardby_user'
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
    addCard: addCard,
    deletecard: deletecard,
    getcardby_user:getcardby_user
}