// var io = require('socket.io')();

// io.on('connection', (socket) => {
//     //console.log("Socket Connected", socket);
//     socket.on('set-online', (data) => {
//         console.log("Online data -----", data);
//         let obj = {
//             userId: data.userId,
//             socketId: data.socketId,
//             isOnline: true
//         }
//           //userCtrl.changeOnlineStatus(data);
//         // io.emit('contact-online',data)
//     })
//     socket.on('set-offline', data => {
//         console.log("offline data -----", data);
//         let obj = {
//             userId: data.userId,
//             socketId: '',
//             isOnline: false
//         }
//         //userCtrl.changeOnlineStatus(data);
//         //io.emit('contact-offline',data)
//     })
//     socket.on('disconnect', (data) => {
//         console.log('Socket disconnect -----', data);
//     })

//     // socket.on("view_notification" , async(id)=>{
//     //     console.log("notification" , id);
//     //     let notification = await notificationModel.findByIdAndUpdate(id , {
//     //         $set : {
//     //             open : true
//     //         }
//     //     } , {new : true});
//     //     console.log("notification" , notification);
//     // })

//     // data == data.from , data.to
//     socket.on('send-message', async (data) => {
//         try {
//             console.log('Aaaaaaa-----', data);
//             //let roomResult = await chatCtrl.checkRoomExist(data);
//             //let roomId = roomResult.roomId;
//             // if(!roomResult.exist){
//             //     let roomResult = await chatCtrl.createRoom(data);
//             //     roomId = roomResult._id;
//             // }
//             // let check = await chatCtrl.saveMessage({
//             //     roomId:roomId, 
//             //     message_id:data.message_id,
//             //     from: data.from, 
//             //     to: data.to, 
//             //     sent:true,
//             //     recieve:false,
//             //     avatar:data.avatar,
//             //     message: data.message,
//             //     createdAt:data.createdAt,
//             //     audio:data.audio?data.audio:'',
//             //     video:data.video?data.video:'',
//             //     image:data.image?data.image:''
//             // });
//             // console.log("check" , check);
//             //let toSocketId = await getSocketId(data.to);
//             // let user = await userModel.findOne({_id:data.to});
           
//             // let from_user = await userModel.findOne({_id:data.from});
//             io.emit('receive-message', {
//                 roomId:'roomId', 
//                 message_id:data.message_id,
//                 from: data.from, 
//                 to: data.to,
//                 sent:true,
//                 recieve:false,
//                 avatar:data.avatar,
//                 createdAt:data.createdAt,
//                 message: data.message,
//                 audio:data.audio?data.audio:'',
//                 video:data.audio?data.video:'',
//                 image:data.image?data.image:''
//             });
//             // if(user.device_token){
//             //     let notification_obj={
//             //         title:'Chat',
//             //         body:`${from_user.name} send you a message!`,
//             //         screen:'Chat'
//             //     }
//             //     firebaseService.sendNotification(user.device_token,notification_obj);
//             //     let newNotification = new notificationModel(Object.assign(notification_obj,{userId:user._id , other_user: from_user._id}));
//             //     await newNotification.save(); 
//             // }
           
//         } catch (error) {
//             console.log('Send message call error -----', error);
//         }
//     })
// });

// module.exports = io;
var io = require('socket.io')();
//let userCtrl = require('./app_backend/apis/v1/users/user.controller');
let userModel =require('./backend/apis/v1/user/user.model');
let chatCtrl = require('./backend/apis/v1/chat/chat-controller');
let firebaseService=require('./backend/services/firebase-notification.service');
const notificationModel = require('./backend/apis/v1/notifications/notification.model');
const {businesModel} = require('./backend/apis/v1/business/business.model');

io.on('connection', (socket) => {
    //console.log("Socket Connected", socket);
    socket.on('set-online', (data) => {
        console.log("Online data -----", data);
        let obj = {
            userId: data.userId,
            socketId: data.socketId,
            isOnline: true
        }
          userCtrl.changeOnlineStatus(data);
        // io.emit('contact-online',data)
    })
    socket.on('set-offline', data => {
        console.log("offline data -----", data);
        let obj = {
            userId: data.userId,
            socketId: '',
            isOnline: false
        }
        userCtrl.changeOnlineStatus(data);
        //io.emit('contact-offline',data)
    })
    socket.on('disconnect', (data) => {
        console.log('Socket disconnect -----', data);
    })

    socket.on("view_notification" , async(id)=>{
        console.log("notification" , id);
        let notification = await notificationModel.findByIdAndUpdate(id , {
            $set : {
                open : true
            }
        } , {new : true});
        console.log("notification" , notification);
    })

    // data == data.from , data.to
    socket.on('send-message', async (data) => {
        try {
            console.log('Send message call -----', data);
            let roomResult = await chatCtrl.checkRoomExist(data);
            let roomId = roomResult.roomId;
            if(!roomResult.exist){
                let roomResult = await chatCtrl.createRoom(data);
                roomId = roomResult._id;
            }
            let check = await chatCtrl.saveMessage({
                roomId:roomId, 
                message_id:data.message_id,
                business_id:data.business_id,
                from: data.from, 
                to: data.to, 
                sent:true,
                recieve:false,
                avatar:data.avatar,
                message: data.message,
                createdAt:data.createdAt,
                audio:data.audio?data.audio:'',
                video:data.video?data.video:'',
                image:data.image?data.image:''
            });
            console.log("check" , check);
            //let toSocketId = await getSocketId(data.to);
            let user = await userModel.findOne({_id:data.to});
            let business = await businesModel.findOne({_id : data.business_id})
            let from_user = await userModel.findOne({_id:data.from});
            io.emit('receive-message', {
                roomId:roomId, 
                message_id:data.message_id,
                from: data.from, 
                business_id:data.business_id,
                business_name : business.business_name,
                business_avatar : business.business_avatar,
                to: data.to,
                sent:true,
                recieve:false,
                avatar:data.avatar,
                createdAt:data.createdAt,
                message: data.message,
                audio:data.audio?data.audio:'',
                video:data.audio?data.video:'',
                image:data.image?data.image:''
            });
            if(user.device_token){
                let notification_obj={
                    title:'Chat',
                    body:`${from_user.full_name} send you a message!`,
                    screen:'Chat',
                    from_user_name :from_user.full_name, 
                    from_user_id : from_user._id,
                    business_id : data.business_id,
                    business_name : business.business_name,
                    business_avatar : business.business_avatar
                    
                }
                firebaseService.sendNotification(user.device_token,notification_obj);
                let newNotification = new notificationModel(Object.assign(notification_obj,{userId:user._id , other_user: from_user._id   }));
                await newNotification.save(); 
            }
           
        } catch (error) {
            console.log('Send message call error -----', error);
        }
    })
});

module.exports = io;