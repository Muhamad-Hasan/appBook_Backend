var mongoose = require('mongoose');

const ChatRoomModel = new mongoose.Schema({
    from:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users'
    },
    to: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users'
    },
    date: {
        type: Date,
        default: Date.now
    },
    business_id : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'business', 
    },
    
} ,{
    timestamps: true
});

module.exports=mongoose.model("chatRooms", ChatRoomModel);