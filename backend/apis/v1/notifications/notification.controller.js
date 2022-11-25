'use strict';

let NotificationModel = require('./notification.model');

let fetchUserWise = async (req, res) => {
    try {
        let { start, rows } = req.query;
        start = start ? parseInt(start) : 0;
        rows = rows ? parseInt(rows) : 100;
        let result;
        let totalResults;
        console.log("start" , start , rows);
        if(start >= 0 && rows > 0){
            console.log("start" , start);
            result = await NotificationModel.find({userId: req.user._id , screen : "Appointment"}).sort({creationDate:"ascending"}).skip(start).limit(rows).populate({
                path: 'userId',
                select: 'name'
              });
            totalResults = await NotificationModel.countDocuments();
        }else { 
            console.log("end" , start);
            result = await NotificationModel.find({userId: req.user._id ,  screen :"Appointment"}).sort({creationDate : "ascending"}).populate({
                path: 'userId',
                select: 'name'
              })
            totalResults = result.length;
        }
        return res.status(200).json({message: 'Notification list', data: result.reverse(), totalRecords : totalResults});
    } catch (error) {
        console.log("err" , error);
        return res.status(500).json({message: 'Unexpected error'});
    } 
}

let  chatNotifications= async (req, res) => {
    try {
        let { start, rows } = req.query;
        let result;
        let totalResults;
        if(start && rows){
            console.log("start" , start);
            result = await NotificationModel.find({userId: req.user._id , screen : "Chat"}).sort(1).skip(+start).limit(+rows).populate({
                path: 'userId',
                select: 'name'
              })
            totalResults = await NotificationModel.countDocuments();
        }else { 
            console.log("start" , start);
            result = await NotificationModel.find({userId: req.user._id , screen : "Chat"}).populate({
                path: 'userId',
                select: 'name'
              })
            totalResults = result.length;
        }
        return res.status(200).json({message: 'Notification list', data: result.reverse(), totalRecords : totalResults});
    } catch (error) {
        return res.status(500).json({message: 'Unexpected error'});
    } 
}

let save = async (req, res) => {
    try {
        let { userId, title, body, screen } = req.body;
        if(!title){
            return res.status(400).json({message: 'Title is required'});
        }
        if(!body){
            return res.status(400).json({message: 'Body required'});
        }
        let obj = {
            userId,
            title,
            body,
            screen
        }
        
        let newNotification = new NotificationModel(obj);
        let result = await newNotification.save();
        if(!result || !result._id){
            return res.status(500).json({message: 'Unexpected error'});
        }
        return res.status(200).json({message: 'Save notification'});
    } catch (error) {
        return res.status(500).json({message: 'Unexpected error'});
    }
}

let deleteNotification = async (req, res) => {
    try {
        let { id } = req.query;
        if(!id){
            return res.status(400).json({message: 'Id is required'});
        }
        let result = await NotificationModel.deleteOne({_id: id});
        console.log("Delete Result ----", result);
        return res.status(200).json({message: 'Delete from notification'});
    } catch (error) {
        return res.status(500).json({message: 'Unexpected error'});
    }
}

const view_notification = async(req , res)=>{
    let {id} = req.query;
    try{
        let notification = await NotificationModel.findByIdAndUpdate(id , {
            $set : {open : true}
        } , {new : true})
        if(notification){
            res.status(200).json({
                status : 1,
                remarks:"Ok",
                data : notification
            })
        }
    }catch(err){
        return res.status(500).json({message: 'Unexpected error'});
    }
} 
module.exports = {
    fetchUserWise: fetchUserWise,
    save: save,
    deleteNotification: deleteNotification,
    view_notification : view_notification,
    chatNotifications : chatNotifications
}