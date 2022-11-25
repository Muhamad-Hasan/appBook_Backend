'use strict';

let chatRoomModel = require('./chat-room.model');
let chatMsgModel = require('./chat-message.model');
let userModel = require('../user/user.model');
// const io = require('../../../../io');
let moment =require('moment');
let timeFormat = (date) =>{
    let now = moment(date)
    // 1:00:00 PM
    return  now.format("hh:mm A");
}
let checkRoomExist = async (data) => {
    try {
        let result = await chatRoomModel.findOne({ $or: [{from: data.from, to: data.to , business_id : data.business_id},{from: data.to, to: data.from ,business_id : data.business_id}]});
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
        //console.log(result)
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
        let obj = { from : data.from, to: data.to , business_id : data.business_id };
        const newChatRoom = new chatRoomModel(obj);
        let result = await newChatRoom.save();
        return result;
    }catch (error){
        return false;
    }
}

let saveMessage = async (data) => {
    try{
        let obj = { roomId: data.roomId, from : data.from, to: data.to, message: data.message,message_id:data.message_id ,image : data.image , business_id : data.business_id  };
        const newChatMessage = new chatMsgModel(obj);
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
        let { from, to } = req.query;
        let room = await chatRoomModel.findOne({ $or: [{from: from, to: to},{from: to, to: from}]});
        if(!room || !room._id){
            return res.status(200).json({message: 'No messages', msgs: null});
        }
        let messages = await chatMsgModel.find({'roomId': room._id}).sort({date: -1})
        let updateMessages=[];
        
        messages.map(item=>{
            let dummy = {
                _id: item.from,
                text: item.message,
                createdAt: item.date,
                user: {
                  _id: item.to,
                 //avatar:'https://media-exp1.licdn.com/dms/image/C5603AQGoKSIkppLUbw/profile-displayphoto-shrink_200_200/0?e=1597276800&v=beta&t=MKrGlpeZiAXKFjnou3gSramHndKbiI5Zg-znR-Vrsg8'
                },
                sent:true,
                recieve:false,
                audio: item.audio ? item.audio : '',
                image: item.image ? item.image : '',
                video: item.video ? item.video : '',
              }
              //console.log(dummy);
              updateMessages.push(dummy);
              
        })
       
        return res.status(200).json({message: 'messages', msgs: updateMessages.reverse()});
    }catch (error){
        return res.status(500).json({message: 'Unexpected error', error: error});
    }
}
let socketgetAllMessages = async ({from,to}) => {
    try{
        let room = await chatRoomModel.findOne({ $or: [{from: from, to: to},{from: to, to: from}]});
        if(!room || !room._id){
            return [];
        }
        let messages = await chatMsgModel.find({'roomId': room._id}).sort({date: -1})
        let updateMessages=[];
        
        messages.map(item=>{
            let dummy = {
                _id: item.to,
                text: item.message,
                createdAt: item.date,
                user: {
                  _id: item.from,
                   avatar:'https://media-exp1.licdn.com/dms/image/C5603AQGoKSIkppLUbw/profile-displayphoto-shrink_200_200/0?e=1597276800&v=beta&t=MKrGlpeZiAXKFjnou3gSramHndKbiI5Zg-znR-Vrsg8'
                },
                sent:true,
                recieve:true,
                audio: item.audio ? item.audio : '',
                image: item.image ? item.image : '',
                video: item.video ? item.video : '',
              }
              //console.log(dummy);
              updateMessages.push(dummy);
              
        })
       
        return  updateMessages
    }catch (error){
        return [];
    }
}
let getAllUsersChatList = async (req, res) => {
    try{
        let chatRooms = await chatRoomModel.find({ $or: [{from: req.user._id},{to: req.user._id}]}, {_id: 1});
        if(!chatRooms || chatRooms.length == 0){
            return res.status(200).json({message: 'No messages', data: null});
        }

        let finalResult = [];
        for(var i = 0; i < chatRooms.length; i++){
            let result = await chatMsgModel.findOne({'roomId': chatRooms[i]._id}).sort({date: -1}).populate({
                path: 'from',
                select: ['full_name','gender','role'],
              }).populate({
                path: 'to',
                select: ['full_name','gender','role'],
              });
              
            let time= await timeFormat(result.date);
            finalResult.push(Object.assign(result.toObject(),{time:time}));
        
        }
        ///console.log(finalResult);
        return res.status(200).json({message: 'All chat messages', data: finalResult});
    }catch (error){
        return res.status(500).json({message: 'Unexpected error', error: error});
    }
}


module.exports = {
    checkRoomExist: checkRoomExist,
    createRoom: createRoom,
    saveMessage: saveMessage,
    getSocketId: getSocketId,
    getAllMessages: getAllMessages,
    socketgetAllMessages:socketgetAllMessages,
    getAllUsersChatList: getAllUsersChatList
}