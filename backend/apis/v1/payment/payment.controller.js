const serviceModel = require('../services/services.model')
const userModel = require('../user/user.model')
const errorModel = require('../err/error.model')
const {addCardDetails , cardToken , createStripeCustomer ,getAllCardDetails , deleteCard}  = require("../../../services/stripe.services")
const Joi = require("@hapi/joi");



const addCard = async (req, res) => {
    const data = req.body;
    const schema = Joi.object({
        number: Joi.number().required(),
        exp_month: Joi.number(),
        exp_year: Joi.number(),
        cvc: Joi.number(),
        name: Joi.string(),

    })

    try {
        console.log("add" , data);
        let value = await schema.validateAsync(data);
        if (!value.error) {
            let customer = req.user;
            if (req.user || !req.user.stripeId) {
                let user = await createStripeCustomer({
                    email: req.user.email,
                })
                console.log("user" ,req.user ,  user);
                customer = await userModel.findByIdAndUpdate(req.user._id, { stripeId: user.id }, { new: true });
                
            }
            const token = await cardToken(data);
            console.log("token" , token , customer);
            if(token && !token.id ){
                return res.status(400).json({
                    status : 0,
                    remarks : "Card Details are not valid"
                })
            }
            const card = await addCardDetails( customer.stripeId , token.id)
            console.log("card" , card);
            if (card && card.id) {
                res.status(200).json({
                    status: 1,
                    remarks: "Ok",
                    data: card
                })
            }else{
                return res.status(400).json({
                    status : 0,
                    remarks : card.raw && card.raw.message ? card.raw.message :  "Card Details is not valid"
                })
            }
        }
    }
    catch (err) {
        console.log("err" , err);
        let obj = {
            usr_id: req.user._id,
            error_name: err,
            api_name: '/review/addreview'
        }
        const error_add = new errorModel(obj)
        await error_add.save();
        res.status(400).json({
            status: 0,
            remarks: err + ' Unexpected Error .....'
        })

    }

}

const getAllCard = async (req, res) => {
    try {
        if (req.user && req.user.stripeId) {
            const cards = await getAllCardDetails(req.user.stripeId);
            res.status(200).json({
                status: 1,
                remarks: "Ok",
                data: cards.data
            })
        } else {
            res.status(200).json({
                status: 1,
                remarks: "No Card Found"
            })
        }

    } catch (err) {
        let obj = {
            usr_id: req.user._id,
            error_name: err,
            api_name: '/review/addreview'
        }
        const error_add = new errorModel(obj)
        await error_add.save();
        res.status(400).json({
            status: 0,
            remarks: err + ' Unexpected Error .....'
        })
    }
}


const deleteUserCard = async(req , res)=>{
    try{
        if(req.user && req.user.stripeId){
            let card = await deleteCard({
                user_id : req.user.stripeId,
                card_id : req.body.card_id
            })
            console.log("card" , card);
            if(card && !card.raw){
                res.status(200).json({
                    status: 1,
                    remarks: "Ok",
                    data: card
                })
            }else{
                res.status(400).json({
                    status: 1,
                    remarks: card && card.raw && card.raw.message,
                    
                })
            }
          
        }
    }catch(err){
        let obj = {
            usr_id: req.user._id,
            error_name: err,
            api_name: '/payment/deletecard'
        }
        const error_add = new errorModel(obj)
        await error_add.save();
        res.status(400).json({
            status: 0,
            remarks: err + ' Unexpected Error .....'
        })
    }
    
}

module.exports = {
    addCard : addCard,
    getAllCard , 
    deleteUserCard : deleteUserCard
   }