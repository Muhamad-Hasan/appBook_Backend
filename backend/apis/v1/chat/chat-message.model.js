var mongoose = require('mongoose');

const ChatMessageModel = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'chatRooms'
    },
    from:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users',
        required:true
    },
    message_id:String,
    to: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users',
        required:true
    },
    message: {
        type: String,
    },
    avatar:String,
    audio:String,
    image:String,
    video:String,
    sent: {
        type: Boolean,
        default: false
    },
    receive: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    business_id : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'business', 
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("chatMessages", ChatMessageModel);