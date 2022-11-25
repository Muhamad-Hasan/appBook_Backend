// var admin = require('../util/firebase-config');


var FCM = require('fcm-node');
var serverKey = 'AAAA0pw74Bs:APA91bE3Pk9QuFcpdzIA_FhoYfGWa-WD_eizMpVCQ0x-nSyShvTUvUu1CzmXyr-97rL4hxKCqjq_lRodFSSbx5HHDgSrLrB60wlgr0mm98msSyugWx8h092KYADnGCSOYHTKsZIcf8Fy';
var fcm = new FCM(serverKey);


const sendNotification = (device_token,object) => { 
    console.log("object" , object);
var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: device_token, 
    collapse_key: 'mmcglobal',
    
    notification: {
        title: object.title, 
        body: object.body ,
        booking_id : object.booking_id , 
        business_id : object.business_id,
        from_user_name : object.from_user_name ? object.from_user_name  : "",
        from_user_id : object.from_user_id ? object.from_user_id  : "",
        business_name : object.business_name ? object.business_name : "",
        business_avatar : object.business_avatar ? object.business_avatar : "",
        buisness_user : object.buisness_user ? object.buisness_user : "",
        
        data: {  //you can send only notification or only data(or include both)
            title: object.title, 
            body: object.body ,
            booking_id : object.booking_id,
            business_id : object.business_id,
            from_user_name : object.from_user_name ? object.from_user_name  : "",
            from_user_id : object.from_user_id ? object.from_user_id  : "",
            business_name : object.business_name ? object.business_name : "",
            business_avatar : object.business_avatar ? object.business_avatar : "",
            buisness_user : object.buisness_user ? object.buisness_user : "",
        },
    },
    
    data: {  //you can send only notification or only data(or include both)
        title: object.title, 
        body: object.body ,
        booking_id : object.booking_id,
        business_id : object.business_id,
        from_user_name : object.from_user_name ? object.from_user_name  : "",
        from_user_id : object.from_user_id ? object.from_user_id  : "",
        business_name : object.business_name ? object.business_name : "",
        business_avatar : object.business_avatar ? object.business_avatar : "",
        buisness_user : object.buisness_user ? object.buisness_user : "",
    },
   
};

fcm.send(message, function(err, response){
    if (err) {
        console.log("Something has gone wrong!");
    } else {
        console.log("Successfully sent with response: ", response);
    }
});
}
// const options = {
//     priority: "high",
//     timeToLive: 60 * 60 * 24
//   };
// const sendNotification = (device_token,object) => {   
//     var message = {
//         notification: {
//           title: object.title,
//           body: object.body,
//           screen:object.screen
//         },
//         //condition: condition
//       }; 
//   admin.messaging().sendToDevice(device_token, message, options)
//   .then( response => {
//     console.log(response);
//    //res.status(200).send("Notification sent successfully") 
//   })
//   .catch( error => {
//       console.log(error);
//   });
// }
module.exports= {
    sendNotification:sendNotification
}    