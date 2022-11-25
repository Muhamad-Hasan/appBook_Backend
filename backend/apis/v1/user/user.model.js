var mongoose=require('mongoose');
var service=require('../../../services/app.services');

const UserModel=new mongoose.Schema({
    avatar:String,
    full_name:{
        type:String ,
        maxlength: 100
    },  
    email:String,
    password:{
        type:String ,
        maxlength: 100,
      
    },
    gender:{
        type:String,
        enum:['Male','Female']
    },
    role:{
        type:String,
        enum:['User','Business']
    },
    access_token:String,
    creationDate: {
        type: Date,
        default: Date.now
    },
    contactNumber: {
        type: String,
        required: [true, 'Contact Number is required'],
    },
    stripeId : String,
    device_token: {
        type : String,
    } , 
    reset_password_token: String,
    reset_password_expires: String,
    user_type: {
        type : String,
        default : "normal"
    }
    
},{
    collection:"users"
})

UserModel.pre("save", async function (next) {
    let user = this;
    
    if (!this.isModified("password")) {
        return next();
    }
    try {
        let result = await service.incryptData(user.password);
        user.password = result;
        next();
    } catch (error) {
        next(error);
    }
});

module.exports=mongoose.model("users",UserModel)