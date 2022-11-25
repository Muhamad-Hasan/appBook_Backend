'use strict';

let chatRoomModel = require('./chat-room.model');
let chatMsgModel = require('./chat-message.model');
let userModel = require('../user/user.model');
let helper = require('../../../util/helper');
const io = require('../../../../io');
let moment =require('moment');
let timeFormat = (date) =>{
    let now = moment(date)
    // 1:00:00 PM
    return  now.format("hh:mm A");
}
let chatUploads= async (req,res) =>{
    try {
    console.log("files" ,req.files)
    let Img = req.files.filter(item => item.fieldname == "images").map(file => file.path);
    let Video =req.files.filter(item => item.fieldname == "video").map(file => file.path);
    let Url = (Img && Img.length > 0) ? Img[0]: (Video && Video.length > 0) ? Video[0] : ''
        return res.status(200).json({url:Url});

}
catch(err){
    
    return res.status(500).json({message: 'Unexpected error', error: err});
}
}
let checkRoomExist = async (data) => {
    try {
        let result = await chatRoomModel.findOne({ $or: [{from: data.from, to: data.to},{from: data.to, to: data.from}]});
        let obj = {
            roomId: '',
            exist: false
        }
        if(result && result._id){
            obj = {
                roomId: result._id,
                exist: true
            }
        }
        console.log(result)
        return obj;
    } catch (error) {
        return {
            roomId: '',
            exist: false
        }
    }
}

let createRoom = async (data) => {
    try{
        let obj = { from : data.from, to: data.to };
        const newChatRoom = new chatRoomModel(obj);
        let result = await newChatRoom.save();
        return result;
    }catch (error){
        return false;
    }
}

let saveMessage = async (data) => {
    try{
        let obj = {
                roomId:data.roomId, 
                from: data.from, 
                to: data.to,
                message: data.message,
                createdAt:data.createdAt,
                audio:data.audio?data.audio:'',
                video:data.audio?data.video:'',
                image:data.image?data.image:''
            }
        const newChatMessage = new chatMsgModel(data);
        let result = await newChatMessage.save();
        return result;
    }catch (error){
        return false;
    }
}

let getSocketId = async (to) => {
    try{
        let result = await userModel.findOne({_id: to}, {socketId: 1});
        return result;
    }catch (error){
        return false;
    }
}

let getAllMessages = async (req, res) => {
    try{
        let { from, to , business_id } = req.query;
        let room = await chatRoomModel.findOne({ $or: [{from: from, to: to , business_id : business_id},{from: to, to: from ,business_id : business_id}]});
        if(!room || !room._id){
            return res.status(200).json({message: 'No messages', msgs: []});
        }
        let messages = await chatMsgModel.find({'roomId': room._id}).sort({date: -1}).populate({path : "from" ,select: ['full_name' , "avatar"], }).populate("business_id")
        let updateMessages=[];
        console.log('length',messages)
        messages.map(item=>{
            let dummy = {
                _id: item.to,
                text: item.message,
                createdAt: item.date,
                user:item.from,
                sent:true,
                recieve:false,
                audio: item.audio ? item.audio : '',
                image: item.image ? item.image : '',
                video: item.video ? item.video : '',
                business_id : item.business_id ? item.business_id : "",
                business_name : item.business_name ? item.business_name : "",
                business_avatar : item.business_avatar ? item.business_avatar : "",  
              }
              updateMessages.push(dummy);
              
            })
            
       
        return res.status(200).json({message: "messages", msgs: updateMessages.reverse()});
    }catch (error){
        console.log(error);
        return res.status(500).json({message: 'Unexpected error', error: error});
    }
}

let getAllUsersChatList = async (req, res) => {
    try{
        console.log("user" , req.user);
        
        let chatRooms = await chatRoomModel.find({ $or: [{from: req.user._id},{to: req.user._id}]}, {_id: 1}).sort({_id : -1});
        let { start, rows } = req.query;
        if(!chatRooms || chatRooms.length == 0){
            return res.status(200).json({message: 'No messages', data: []});
        }

        let finalResult = [];
        let result;
        for(var i = 0; i < chatRooms.length; i++){
           if(start&&rows){
              result = await chatMsgModel.findOne({'roomId':chatRooms[i]._id})
              .skip(+start).limit(+rows).sort({date: -1}).populate({
                path: 'from',
                select: ['full_name','gender','role' , 'avatar'],
              }).populate({
                path: 'to',
                select: ['full_name','gender','role' , 'avatar'],
              })
              .populate("business_id");
           }
           else{ 
             result = await chatMsgModel.findOne({'roomId': chatRooms[i]._id})
            .sort({date: -1}).populate({
                path: 'from',
                select: ['full_name','gender','role' , "avatar"],
              }).populate({
                path: 'to',
                select: ['full_name','gender','role' , "avatar"],
              }).populate("business_id");
            }  
            let time= await timeFormat(result.date);
            if(result.from && result.to ){
                finalResult.push(Object.assign(result.toObject(),{time:time}));
            }
            
            
        }
        console.log(finalResult);
        return res.status(200).json({message: 'All chat messages', data: finalResult});
    }catch (error){console.log(error);
        return res.status(500).json({message: 'Unexpected error', error: error});
    }
}


module.exports = {
    checkRoomExist: checkRoomExist,
    chatUploads:chatUploads,
    createRoom: createRoom,
    saveMessage: saveMessage,
    getSocketId: getSocketId,
    getAllMessages: getAllMessages,
    getAllUsersChatList: getAllUsersChatList
}