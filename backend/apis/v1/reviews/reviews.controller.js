const reviewModel = require('./reviews.model')
const serviceModel = require('../services/services.model')
const userModel = require('../user/user.model')
const errorModel = require('../err/error.model')
const {businesModel} = require('../business/business.model')
// const businessModel = require('../business/business.model')

const addReviews = async (req, res) => {
    try {
        let { business_id } = req.query;
        let {
            reviews,
            Stars } = req.body;
        let obj = {
            reviews,
            Stars
        }
        for (let [key, value] of Object.entries(obj)) {
            if (!value || value == '') {
                res.json({
                    status: 0,
                    remarks: `${key} : is required`
                })
            }
        }
        // console.log(req.user)
        // let service = await serviceModel.findOne({ _id: service_id })
        let business = await businesModel.findOne({_id: business_id})
        let user = await userModel.findOne({ _id: req.user._id })

        if (business) {
            let totalRating = 0;
            let sum = 0;
            let obj = {
                usr_id: user._id,
                usr_name: user.full_name,
                // service_id: service._id,
                // service_name: service.service_name,
                business_id: business_id,
                business_name: business.business_name,
                avatar: user.avatar,
                reviews: reviews,
                Stars: Stars
            }
            let review = new reviewModel(obj);
            await review.save();
            
            //Calculating Review Stars
            let count = await reviewModel.countDocuments({ business_id: business_id });
            let stars = await businesModel.findOne({ _id: business_id });
           // business.Stars==0 ? business.Stars = 1 : business.Stars=business.Stars;
            sum = (count-1) * stars.Stars;
            let newSum = sum + parseInt(Stars);
            totalRating = newSum/count;
            console.log(totalRating);
            await businesModel.findByIdAndUpdate({_id:business_id}, {Stars: totalRating});
            if (review) {
                res.json({
                    status: 1,
                    remarks: 'Review Added Successfully'
                })
            }
        }
    } catch (err) {
        let obj = {
            usr_id: req.user._id,
            error_name: err,
            api_name: '/review/addreview'
        }
        const error_add = new errorModel(obj)
        await error_add.save();
        res.json({
            status: 0,
            remarks: err + ' Unexpected Error .....'
        })
    }
}

const getReviews = async (req, res) => {
    try {
        let { business_id } = req.query
        let result = await reviewModel.find({business_id : business_id}).populate("usr_id").lean()
        let data = []
        result.forEach(r=>{
            if(r.usr_id.user_type == "normal"){
                data = [...data ,{...r , 'avatar':`http://35.178.205.72:5013/${r.avatar}`}]
            }
            
        })
        if (result) {
            res.json({
                status: 1,
                remarks: "Ok",
                data: data
            })

        }

    } catch (err) {
        let obj = {
            usr_id: req.user._id,
            error_name: err,
            api_name: '/review/getreviews'
        }
        const error_add = new errorModel(obj)
        await error_add.save();
        res.json({
            ststus: 0,
            remarks: err + ' Unexpected Error .....'
        })
    }
}

module.exports = {
    addReviews: addReviews,
    getReviews: getReviews
}