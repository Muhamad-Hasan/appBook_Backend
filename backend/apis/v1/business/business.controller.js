const { businesModel, detailModel, faqsModel, timingsModel, bridgeModel, favoriteModel } = require('./business.model')
const AppointmentModel = require("../appointment/appointment.model")
const mongoose = require('mongoose');
const Joi = require("@hapi/joi");
const ServiceModel = require("../services/services.model")
const dateObj = require("date-and-time")
let fs = require('fs');
const errorModel = require('../err/error.model');
const businessModel = require('./business.model');

const addBusiness = async (req, res) => {

    try {
        let {
            business_name,
            email,
            mobile,
            location,
            business_tagline,
            longitude,
            latitude,
            country,
            city,
            postal_code,
            gender,
            business_category,
            business_description,
            mon_active,
            mon_from,
            mon_to,
            tues_active,
            tues_from,
            tues_to,
            wed_active,
            wed_from,
            wed_to,
            thurs_active,
            thurs_from,
            thurs_to,
            fri_active,
            fri_from,
            fri_to,
            sat_active,
            sat_from,
            sat_to,
            sun_active,
            sun_from,
            sun_to,
            faqs_text,
            loc ,
            experience_level ,
            qualifications,
            years_established ,
            staff,
            branches,
            speciality_area,
            image , 
            image_detail
        } = req.body;
        console.log("location" , loc);
        let image_detail_array = image_detail;
        //avatar:req.file&&req.file.path? req.file.path:"",
        
        // let image = req.files.filter(item => item.fieldname == 'image');
        // let image_detail = req.files.filter(item => item.fieldname != 'image');
        console.log("files" , req.files);
        // image_detail.map(item => { image_detail_array.push(item.path); })
        let obj = {
            usr_id: req.user._id,
            business_name,
            email,
            mobile,
            gender,
            business_tagline,
            country,
            city,
            postal_code,
            latitude,
            longitude,
            loc :[parseFloat(latitude) , parseFloat(longitude)],
            business_avatar: image,
            experience_level ,
            qualifications,
            years_established ,
            staff,
            branches,
            speciality_area

        }

        for (let [key, value] of Object.entries(obj)) {
            if(key!='business_avatar')
            if (!value || value == '') {
                res.json({
                    status: 0,
                    remarks: `${key} : is required`
                })
            }
        }
        // businesModel.createIndex( { "loc" : "2dsphere" } )
        let bussiness = new businesModel(obj);
        await bussiness.save();

        var bussinessdetail = {}
        var business_timing = {}
        let business_faqs = {}
        var bridge_schema ={}

        if (bussiness._id != '') {
            let obj_detail = {
                usr_id: req.user._id,
                business_id: bussiness._id,
                business_category,
                business_description,
                business_photos: image_detail_array
            }

            bussinessdetail = new detailModel(obj_detail);
            await bussinessdetail.save();
        }

        if (bussinessdetail._id != '') {
            let obj_timing = {
                usr_id: req.user._id,
                business_id: bussiness._id,
                monday: {
                    mon_active,
                    mon_from,
                    mon_to,
                },
                tuesday:
                {
                    tues_active,
                    tues_from,
                    tues_to,
                },
                wednessday:
                {
                    wed_active,
                    wed_from,
                    wed_to,
                },
                thursday:
                {
                    thurs_active,
                    thurs_from,
                    thurs_to,
                },
                friday:
                {
                    fri_active,
                    fri_from,
                    fri_to,
                },
                saturday:
                {
                    sat_active,
                    sat_from,
                    sat_to,
                },
                sunday:
                {
                    sun_active,
                    sun_from,
                    sun_to
                }
            }
            business_timing = new timingsModel(obj_timing)
            await business_timing.save();

        }

        if (business_timing._id != '') {
            let obj_faqs = {
                usr_id: req.user._id,
                business_id: bussiness._id,
                faqs_text: faqs_text ? JSON.parse(faqs_text) : {},
            }
            business_faqs = new faqsModel(obj_faqs)
            await business_faqs.save();
        }
        
        if (business_faqs._id != '') {
            let obj = {
                usr_id: req.user._id,
                business_id : bussiness._id,
                businessDetail_id: bussinessdetail._id,
                timings_id: business_timing._id,
                businessFaq_id: business_faqs._id,
            }
            bridge_schema = new bridgeModel(obj)
            await bridge_schema.save();
            res.json({
                status: 1,
                remarks: 'Business Added Sucessfully',
                data : bussiness
            })
        }
    } catch (err) {
        console.log("err" , err);
        let obj = {
            usr_id: req.user._id,
            error_name: err,
            api_name: '/business/addbusiness'
        }
        const error_add = new errorModel(obj)
        await error_add.save();
        res.json({
            status: 0,
            remarks: err + ' Unexpected Error .....'
        })
    }
}

const getfaqs = async (req, res) => {
    try {
        let { business_id } = req.query
        let result = await faqsModel.findOne({ business_id: business_id })
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
            api_name: '/business/getfaqs'
        }
        const error_add = new errorModel(obj)
        await error_add.save();
        res.json({
            status: 0,
            remarks: err + ' Unexpected Error .....'
        })
    }
}

const updateBusiness = async (req, res) => {

    try {
        let { id } = req.query;
        let {
            business_name,
            email,
            mobile,
            business_tagline,
            location,
            country,
            city,
            postal_code,
            business_category,
            business_description,
            mon_active,
            mon_from,
            mon_to, 
            tues_active,
            tues_from,
            tues_to,
            wed_active,
            wed_from,
            wed_to,
            thurs_active,
            thurs_from,
            thurs_to,
            fri_active,
            fri_from,
            fri_to,
            sat_active,
            sat_from,
            sat_to,
            sun_active,
            sun_from,
            sun_to,
            faqs_text,
            image,
            image_detail
        } = req.body;

        let image_detail_array = image_detail;
        // let image = req.files.filter(item => item.fieldname == 'image');
        // let image_detail = req.files.filter(item => item.fieldname != 'image');

        // image_detail.map(item => {
        //     image_detail_array.push(item);
        // })
        let obj = {
            usr_id: req.user._id,
            business_name,
            email,
            mobile,
            business_tagline,
            location,
            country,
            city,
            postal_code,
            business_avatar: image
        }
        for (let [key, value] of Object.entries(obj)) {
            if (!value || value == '') {
                res.json({
                    status: 0,
                    remarks: `${key} : is required`
                })
            }
        }

        let bussiness = await businesModel.findOneAndUpdate({ _id: id }, { $set: obj },{new : true});

        if (bussiness._id != '') {
            let obj_detail = {
                usr_id: req.user._id,
                business_id: bussiness._id,
                business_category,
                business_description,
                business_photos: image_detail_array
            }
            let bussinessdetail = await detailModel.findOneAndUpdate({ business_id: id }, { $set: obj_detail });

            if (bussinessdetail._id != '') {
                let obj_timing = {
                    usr_id: req.user._id,
                    business_id: bussiness._id,
                    monday: {
                        mon_active,
                        mon_from,
                        mon_to,
                    },
                    tuesday:
                    {
                        tues_active,
                        tues_from,
                        tues_to,
                    },
                    wednessday:
                    {
                        wed_active,
                        wed_from,
                        wed_to,
                    },
                    thursday:
                    {
                        thurs_active,
                        thurs_from,
                        thurs_to,
                    },
                    friday:
                    {
                        fri_active,
                        fri_from,
                        fri_to,
                    },
                    saturday:
                    {
                        sat_active,
                        sat_from,
                        sat_to,
                    },
                    sunday:
                    {
                        sun_active,
                        sun_from,
                        sun_to
                    }
                }

                let business_timing = await timingsModel.findOneAndUpdate({ business_id: id }, { $set: obj_timing });

                if (business_timing._id != '') {
                    let obj_faqs = {
                        usr_id: req.user._id,
                        business_id: bussiness._id,
                        faqs_text: JSON.parse(faqs_text)
                    }
                    let business_faqs = await faqsModel.findOneAndUpdate({ business_id: id }, { $set: obj_faqs })
                    if (business_faqs._id != '') {
                        res.json({
                            status: 1,
                            remarks: 'Business Updated Sucessfully'
                        })
                    }
                }
            }
        }
    } catch (err) {

        let obj = {
            usr_id: req.user._id,
            error_name: err,
            api_name: '/business/updatebusiness'
        }
        const error_add = new errorModel(obj)
        await error_add.save();
        res.json({
            status: 0,
            remarks: err + ' Unexpected Error .....'
        })
    }
}
const addfavorite = async (req, res) => {

    try {
        // let { id } = req.query
        let {business_id} = req.body;
        let business = await favoriteModel.findOne({ usr_id: req.user._id, business_id: business_id });
        if (business) {
                await favoriteModel.deleteOne({ _id: business._id })
               
                    res.json({
                        status: 1,
                        remarks: 'Business Removed from favorites Successfully'
                    })          
           }   
           else{
               let obj = {
                   usr_id: req.user._id,
                   business_id: business_id,
               }
               let favorites = new favoriteModel(obj);
               await favorites.save(obj);
               res.json({
                status: 1,
                remarks: 'Business Added to favorites Successfully',
                data : favorites
            })    
           }
    } catch (err) {
        let obj = {
            usr_id: req.user._id,
            error_name: err,
            api_name: '/business/deletebusiness'
        }
        const error_add = new errorModel(obj)
        await error_add.save();
        res.json({
            status: 0,
            remarks: err + ' Unexpected Error .....'
        })
    }

}
const getfavorite = async (req, res) => {

    try {
         let { start , rows } = req.query;
         start = start ? start : 0
         rows = rows ? rows  : 100
        let ids = [];
        let data =  await favoriteModel.find({ usr_id: req.user._id });
        console.log("user" , req.user._id , data);
        data.map(text=>{
            ids =  [...ids , text.business_id];
        })
        let result = await bridgeModel.find({business_id:{$in : ids}}).lean().populate('business_id').populate('businessDetail_id').populate('timings_id').populate('businessFaq_id');
        console.log("ids" , ids , result);
        for (let index = 0; index < result.length; index++) {
            let fav = await favoriteModel.countDocuments({business_id : result[index].business_id})
            result[index]["favourite_count"] = fav 
         }
            
        if (data) {
            res.json({
            status: 1,
            remarks: 'The favorite bussiness are as follows:',
            data: result
            })    
            return;      
           }   
           else{
               res.json({
                status: 1,
                remarks: 'No favorites found.'
            })    
            return;
           }
    } catch (err) {
        let obj = {
            usr_id: req.user._id,
            error_name: err,
            api_name: '/business/deletebusiness'
        }
        const error_add = new errorModel(obj)
        await error_add.save();
        res.json({
            status: 0,
            remarks: err + ' Unexpected Error .....'
        })
    }

}

const deleteBusiness = async (req, res) => {

    try {
        let { id } = req.query
        let business = await businesModel.findOne({ _id: id })
        if (business._id) {
            await fs.unlinkSync(business.business_avatar)
            await businesModel.deleteOne({ _id: business._id })
            let detail = await detailModel.findOne({ business_id: id })
            if (detail) {
                for (var i = 1; i < detail.business_photos.length; i++) {
                    await fs.unlinkSync(detail.business_photos[i])
                }
                await detailModel.deleteOne({ _id: detail._id })
                let timings = await timingsModel.findOne({ business_id: id })
                if (timings) {
                    await timingsModel.deleteOne({ _id: timings._id })
                    let faqs = await faqsModel.findOne({ business_id: id })
                    if (faqs) {
                        await faqsModel.deleteOne({ _id: faqs._id })
                        res.json({
                            status: 1,
                            remarks: 'Business Remove Successfully'
                        })
                    }
                }
            }
        }
    } catch (err) {
        let obj = {
            usr_id: req.user._id,
            error_name: err,
            api_name: '/business/deletebusiness'
        }
        const error_add = new errorModel(obj)
        await error_add.save();
        res.json({
            status: 0,
            remarks: err + ' Unexpected Error .....'
        })
    }

}

const getBusiness = async (req, res) => {
    try {
        let { id } = req.query;
        let {start , rows} = req.body;
        start = start ? start : 0;
        rows = rows ? rows : 100;
        id = id ? id : '';
        if( id != "")
        {
            console.log('Query phase: \t');
            result = await bridgeModel.find({usr_id:id}).lean().populate('business_id').populate('businessDetail_id','business_photos business_description business_category Stars').populate('timings_id').populate('businessFaq_id');
            res.json({
                status: 1,
                remarks: "Ok",
                data: result
            })
            return;
        }
    else{
        let { category, business_name, business_id } = req.body;
        let result = '';
        let dataresult = [];
        let business_list = [];
        category = category ? category : '';
        business_name = business_name ? business_name : '';
        business_id = business_id ? business_id : '';
        if (category != '') {
            result = await detailModel.find({ business_category: category });
        } else if (category == '' && business_name == '') {
            result = await bridgeModel.find().skip(start).limit(rows).lean().populate('business_id').populate('businessDetail_id','business_photos business_description business_category Stars').populate('timings_id').populate('businessFaq_id');
            res.json({
                status: 1,
                remarks: "Ok",
                data: result
            })
            return;
        } else if (business_name != '') {
          let business_result = [];
            result = await businesModel.find({business_name:business_name})
            if (result.length > 1) {
                for (i = 0; i < result.length; i++) {
                     business_result = await bridgeModel.find({business_id:result[i]._id}).lean().populate('business_id').populate('businessDetail_id','business_photos business_category Stars').populate('timings_id').populate('businessFaq_id');
                    business_list.push(business_result)
                }
                res.json({
                    status: 1,
                    remarks: "Okay",
                    data: business_list
                })
                return;
            }
            business_result = await bridgeModel.find({business_id:result[0]._id}).lean().populate('business_id').populate('businessDetail_id','business_photos business_category Stars').populate('timings_id').populate('businessFaq_id');
            res.json({
                status: 1,
                remarks: "Okay",
                data: business_result
            })
            return;
        } 
        else if (business_id != '') {
          
            result = await bridgeModel.find({business_id:business_id}).lean().populate('business_id').populate('businessDetail_id','business_photos business_category Stars').populate('timings_id').populate('businessFaq_id');
            res.json({
                status: 1,
                remarks: "Ok",
                data: result
            })
            return;
        } 
        if (result.length > 1) {
            console.log(category)
            for (i = 0; i < result.length; i++) {
              let  business_result = await bridgeModel.find({business_id:result[i].business_id}).lean().populate('business_id').populate('businessDetail_id','business_photos business_category Stars').populate('timings_id').populate('businessFaq_id');
               business_list.push(business_result)
           }
            res.json({
                status: 1,
                remarks: "Okay",
                data: business_list
            })
            return;
        } else {
            let business_result = await businesModel.find({ _id: result[0].business_id })
            res.json({
                status: 1,
                remarks: "Okay",
                data: business_result
            })
            return;
        }
    }
    } catch (err) {
        let obj = {
            usr_id: req.user._id,
            error_name: err,
            api_name: '/business/getBusinessby_category'
        }
        const error_add = new errorModel(obj)
        await error_add.save();
        res.json({
            status: 0,
            remarks: err + ' Unexpected Error .....'
        })
        
    }
}


const search_business = async(req , res)=>{
    const {name , category } =req.query;
    try{
        let exp = new RegExp(name)
        // res.json(exp)
        // if(ca)
        console.log("exp" , exp);
         if(!category)
         { 
             console.log("run", req.query);
                let category  = await detailModel.find({$or : [{business_category :{$regex : exp  ,$options: 'i'}} , {business_description :{$regex : exp  ,$options: 'i'}}]}) 
        let ids =[];
        category.forEach(c=>{
            ids =[...ids , c.business_id]
        })
        let names = await  businesModel.find({$or : [{business_tagline :{$regex : exp  ,$options: 'i'}} , {business_name :{$regex : exp  ,$options: 'i'}} ]});
        names.forEach(c=>{
            ids =[...ids , c._id]
        })
      console.log("ids" , ids);
       let business = await bridgeModel.find({business_id: {$in : ids}}).lean().populate('business_id').populate('businessDetail_id','business_photos business_description business_category Stars').populate('timings_id').populate('businessFaq_id');
        // res.status(200).json(business)
        res.json({
            status: 1,
            remarks: "Okay",
            data: business
        })
    }else{
        console.log("catt", req.query , category);
        let categoryData  = await detailModel.find({$or : [{business_category :{$regex : category  ,$options: 'i'}} ]}) 
        let ids =[];
        let all_ids = []
        categoryData.forEach(c=>{
            ids =[...ids , `${c.business_id}`]
        })
        let names = await  businesModel.find({$or : [{business_tagline :{$regex : exp  ,$options: 'i'}} , {business_name :{$regex : exp  ,$options: 'i'}} ]});
        names.forEach(c=>{
            console.log("c" , ids , c._id, ids.includes(`${c._id}`));
            if (ids.includes(`${c._id}`)){
                console.log("nice" , c._id);
                all_ids =[...all_ids , c._id]
            }
            
        })
        // all_ids =[...all_ids , ...ids]
       let business = await bridgeModel.find({business_id: {$in : all_ids}}).lean().populate('business_id').populate('businessDetail_id','business_photos business_description business_category Stars').populate('timings_id').populate('businessFaq_id');
        // res.status(200).json(business)
        res.json({
            status: 1,
            remarks: "Okay",
            data: business , 
        })
    }
        
    }catch(err){
        console.log(err);
        res.status(400).json(err)
    }
}

const search_business_name = async(req , res)=>{
    const {name } =req.query;
    try{
        let exp = new RegExp(name);
        

        // res.json(exp)
        let names = await  businesModel.find({business_name :{$regex : exp  ,$options: 'i'}});
        let category  = await detailModel.find({business_category :{$regex : exp  ,$options: 'i'}})
        // console.log("names" , names);
        let name_array = [];
        category.forEach(m=>{
            name_array=[...name_array , m.business_category]
        })
        names.forEach(n=>{
            name_array=[...name_array , n.business_name]
        })
        
        let new_array =[...new Set(name_array)]
        res.json({
            status: 1,
            remarks: "Okay",
            data: new_array
        })
        // res.status(200).json(new_array);
    }catch(err){
        console.log("err" , err);
        res.status(400).json(err)
    }
}



const availableSlots = async(req , res)=>{
    const data = req.body;
    const schema = Joi.object({
        date : Joi.string().required(),
        day : Joi.string().required(),
        service_id : Joi.string().required()
    })
    let date = data.date.toString()
    var days = {
        'monday': 'mon',
        'tuesday': 'tues',
        'wednesday': 'wed',
        'thursday': 'thurs',
        'friday': 'fri', 
        'saturday': 'satur',
        'sunday': 'sun'
      }
      console.log("data" , data);
    try{
        let value = await schema.validateAsync(data);
        if(!value.error){
            let service_timings = {};
        let booked_service = []
        let appointments = []
        let appointment = await AppointmentModel.find({"service.date" :date , "service.service_id" : data.service_id });
        console.log("appointment" ,appointment );
        if(appointment.length > 0){
            appointment.forEach(a=>{
                appointments = [...appointments , ...a.service]
            })
            for (let i = 0; i < appointments.length; i++) {
                if(booked_service.find(element => element.time == appointments[i].time)){
                    booked_service = booked_service.map(m=>{
                        if(m.time == appointments[i].time ){
                            m.free_space = m.free_space -1
                        }
                        return m
                    })
                }else{
                    booked_service = [...booked_service ,{time : appointments[i].time , user_count :appointments[i].user_count ? appointments[i].user_count : 1 ,free_space: appointments[i].user_count  ? appointments[i].user_count -1: 1 ,duration : appointments[i].duration ? appointments[i].duration : 15 }] 
                
                }
                
            }
            // return res.json({booked_service , appointments})
            let timing = await timingsModel.findOne({business_id :appointment[0].business_id});
            console.log("Object.key" , days.monday , days[data.day]);
            if(Object.keys(timing._doc).includes(data.day)){
                let field = days[data.day]+"_active";
                console.log("filesssss" , field);
                if(timing[data.day][field]){
                    service_timings["start"] = timing[data.day][days[data.day]+"_from"],
                    service_timings["end"] = timing[data.day][days[data.day]+"_to"]
                }else{
                    return res.status(400).json({
                        status : 0,
                        remarks : "Service is not available on "+data.day
                    })
                }
            }else{
                return res.status(400).json({
                    status : 0,
                    remarks : "Not a valid day"
                })
            }
            let start_time = parseInt(service_timings.start);
            let end_time = parseInt(service_timings.end);
            let hours = []
            let slots = [];
            let new_hour = [];
            booked_service.forEach(s=>{
                slots = [...slots  , parseInt(s.time)]
            })
            let duration  = booked_service[0].duration;
            let remove_items =[]
            let time_array = []
            if(!booked_service.find(element => parseInt(element.time) == start_time)){
                time_array = [start_time.toString()]
            }
            // return res.json({booked_service , start_time , time_array})
            if(start_time <end_time ){
                let time  = start_time.toString() ;
                console.log("now" , dateObj.format(dateObj.addMinutes( new Date(0 , 0 , 0 , start_time , 0 , 0) , 30) , 'HH:mm'));
                do {
                
                    console.log("first" , time);
                    time = dateObj.format(dateObj.addMinutes(new Date(0 , 0 , 0 , time.substring(0 , 2) , time.substring(3)?  time.substring(3):0, 0 ), duration) , 'HH:mm')
                    time_array=[...time_array , time]
                    console.log("time" , time , parseInt(time) , end_time);
                 } while (parseInt(time) < end_time);
                // return res.json(time_array)
                 time_array.forEach(t=>{
                    let check = booked_service.filter(f=> `${f.time}` == t)
                    
                    console.log("check" ,check ,`${booked_service[0].time}` , t );
                    if(check.length == 0 ){
                       
                        new_hour=[...new_hour , t]
                        booked_service = booked_service.map(i=>{
                           
                            if(`${i.time}` == t ){
                                i["free_space"] = i["free_space"] - 1
                          
                            }
                            return i
                            
                        })
                    }else if (check.length > 0){
                        
                       
                            
                            if(check[0].free_space > 0  ){
                                new_hour=[...new_hour , t]
                                booked_service = booked_service.map(i=>{
                                   
                                    if(`${i.time}` == t){
                                        i["free_space"] = i["free_space"] - 1
                                       }
                                    return i
                                })
                            }else{
                                console.log("else"  ,t);
                            }
                           
                      
                    }
                 })
               
            }else{
                return res.status(400).json({
                    status:0,
                    remarks:"start time greater than end time"
                })
                // start_time = start_time> 12 ? start_time -12 : start_time;
                // end_time = end_time> 12 ? end_time -12 : end_time;
                // let time  = start_time.toString() ;
                
                // console.log("now" , dateObj.format(dateObj.addMinutes( new Date(0 , 0 , 0 , start_time , 0 , 0) , 30) , 'HH:mm'));
                // do {
                
                //     console.log("first" , time);
                //     time = dateObj.format(dateObj.addMinutes(new Date(0 , 0 , 0 , time.substring(0 , 2) , time.substring(3)?  time.substring(3):0, 0 ), duration) , 'HH:mm')
                //     time_array=[...time_array , time]
                //     console.log("time" , time , parseInt(time) ,dateObj.format(new Date(0 , 0 , 0 , end_time ,0, 0 ) , "hh")  ,end_time);
                //  } while (dateObj.format(new Date(0 , 0 , 0 , time.substring(0 , 2) ,0, 0 ) , "hh") < end_time);
                 
                //  time_array.forEach(t=>{
                //     let check = booked_service.filter(f=> `${f.time}` == t)
                //     if(check.length == 0){
                //         new_hour=[...new_hour , t]
                //     }
                //  })
               
            }
           
            let obj = {
                start_time : parseInt(service_timings.start),
                end_time : parseInt(service_timings.end),
                booked_slots : [slots]
            }
            res.status(200).json({
                status : 1 , 
                remarks:"Ok",
                data:new_hour , 
            }) 
        }else{
            let serviceData = await ServiceModel.findById(data.service_id);
            console.log("serviceData" , serviceData);
            if(serviceData){
                let timing = await timingsModel.findOne({business_id :serviceData.business_id});
            console.log("Object.keys" ,timing , days.monday , days[data.day]);
            if(Object.keys(timing._doc).includes(data.day)){
                let field = days[data.day]+"_active";
                console.log("filesssss" , field);
                if(timing[data.day][field]){
                    service_timings["start"] = timing[data.day][days[data.day]+"_from"],
                    service_timings["end"] = timing[data.day][days[data.day]+"_to"]
                }else{
                    return res.status(400).json({
                        status : 0,
                        remarks : "Service is not available on "+data.day
                    })
                }
            }else{
                return res.status(400).json({
                    status : 0,
                    remarks : "Not a valid day"
                })
            }
            let duration = serviceData.service_duration
            let start_time = parseInt(service_timings.start) 
            let end_time = parseInt(service_timings.end)
            let hours = []
            let slots = [];
            let new_hour = []
            console.log("start" , start_time , end_time);
            let time_array = [start_time.toString()]
            booked_service.forEach(s=>{
                slots = [...slots  , parseInt(s)]
            })
            if(start_time <end_time ){
                // for (let i = start_time; i < end_time; i+=0.5) {
                //     console.log("i" , i);
                //     if(!slots.includes(i)){
                //         let time = Math.floor(i)+":30";
                //         if(i % 1 == 0){
                //            time = i.toFixed(0)+":00"
                //         } 
                //      hours=[...hours , time]
                //     }
                     
                //  }
                let time  = start_time.toString() ;
                console.log("now" , dateObj.format(dateObj.addMinutes( new Date(0 , 0 , 0 , start_time , 0 , 0) , 30) , 'HH:mm'));
                do {
                
                    console.log("first" , time);
                    time = dateObj.format(dateObj.addMinutes(new Date(0 , 0 , 0 , time.substring(0 , 2) , time.substring(3)?  time.substring(3):0, 0 ), duration) , 'HH:mm')
                    time_array=[...time_array , time]
                    console.log("time" , time , parseInt(time) , end_time);
                 } while (parseInt(time) < end_time);
                 
                 time_array.forEach(t=>{
                    let check = booked_service.filter(f=> `${f.time}` == t)
                    if(check.length == 0){
                        new_hour=[...new_hour , t]
                    }
                 })
               
            }else{
                return res.status(400).json({
                    status:0,
                    remarks:"start time greater than end time"
                })
                // for (let i = end_time; i<start_time; i+=0.5) {
                //     console.log("i" , i);
                //     if(!slots.includes(i)){
                //         let time = Math.floor(i)+":30";
                //         if(i % 1 == 0){
                //            time = i.toFixed(0)+":00"
                //         }   
                //      hours=[...hours , time]
                //     }
                     
                //  }
            }
           
            let obj = {
                start_time : parseInt(service_timings.start),
                end_time : parseInt(service_timings.end),
                booked_slots : [...new Set(slots)]
            }
            res.status(200).json({
                status : 1 , 
                remarks:"Ok",
                data :  new_hour 
            })
            }
            // res.status(201).json(serviceData)
        }
        
        }
        
    }catch(err){
        console.log("err" , err);
        res.status(400).json(err)
    }
}

const buisness_range = async(req , res)=>{
    const data = req.body;
    const schema = Joi.object({
        latitude : Joi.number().required(),
        longitude : Joi.number().required(),
        range : Joi.number(),
        start : Joi.number(),
        rows : Joi.number()
    })
    try{
        let value = await schema.validateAsync(data);
        // await businesModel.createIndex( { "loc" : "2dsphere" } )
        if(!value.error){
            let range = data.range ? data.range : 20; 
            let ids = []
            let {start , rows} = data;
            start = start ? parseInt(start) : 0;
            rows = rows ? parseInt(rows) : 100;
            let business = await businesModel.find({
                loc: { $near: [ data.latitude , data.longitude ]  , $maxDistance: range}
            });
            console.log("business" ,business );
            business.forEach(id=>{
                ids = [...ids , id._id];
            })
            let  business_result = await bridgeModel.find({business_id :{$in:ids}}).skip(start).limit(rows).lean().populate('business_id').populate('businessDetail_id','business_photos business_category Stars').populate('timings_id').populate('businessFaq_id');
            for (let index = 0; index < business_result.length; index++) {
               let fav = await favoriteModel.countDocuments({business_id : business_result[index].business_id})
               business_result[index]["favourite_count"] = fav 
            }
            // let business_result = await bridgeModel.aggregate([
            //     { $match: { business_id: {$in:ids} } },

            //     { '$facet'    : {
            //         metadata: [ { $count: "total" }, { $addFields: { page: 1 } } ],
            //         data: [ { $skip: 0 }, { $limit: 10 } ] // add projection here wish you re-shape the docs
            //     } }
            // ]);
            res.status(200).json({
                status:1,
                remarks:"Ok",
                data : business_result
            });
        }
       
    }catch(err){
        console.log("err" , err);
        res.status(400).json(err)
    }
}

const finance = async(req , res)=>{
    try{
        let {id} = req.query;
        let business = await AppointmentModel.find({business_id : id}).lean();
        let all_services = [];
        business.forEach(element => {
            all_services = [...all_services  , ...element.service]
        });
        let revenue = await businesModel.findOne({_id :id})
      
        let obj = {
            revenue : revenue.revenue,
            total_services : all_services.length,
            completed_service : all_services.filter(f=> f.status == "Completed").length,
            cancelled_service : all_services.filter(f=> f.status == "Cancelled").length,
            accepted_service : all_services.filter(f=> f.status == "Accepted").length,
            rejected_service : all_services.filter(f=> f.status == "Rejected").length,
            pending_service : all_services.filter(f=> f.status == "Pending").length,
            
            
            
        }
        res.status(200).json({
            status:1,
            remarks:"Ok",
            data : obj
        })

    }catch(err){
        console.log("err" , err);
        res.status(400).json(err)
    }
}

module.exports = {
    addBusiness: addBusiness,
    updateBusiness: updateBusiness,
    deleteBusiness: deleteBusiness,
    getfaqs: getfaqs,
    getBusiness: getBusiness,
    addfav: addfavorite,
    getfav: getfavorite,
    search_business : search_business,
    search_business_name : search_business_name,
    availableSlots : availableSlots,
    buisness_range : buisness_range,
    finance: finance
}