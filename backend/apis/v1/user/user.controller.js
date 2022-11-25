'use strict';

let userModel = require('./user.model');
var service = require('../../../services/app.services');
var jwt = require('../../../services/jwtHelper.services');
var errHandler = require('../../../util/errorHandler');
let helper = require('../../../util/helper')
let moment = require('moment');
let errorModel = require('../err/error.model')
let auditModel = require('../user_audit/audit.model')
const crypto = require("crypto");
const Email = require("../../../services/mail.service");
const Joi = require("@hapi/joi")
// TODO -- Need to change company_name to companyId

const register = async (req, res) => {
    try {
        let {
            full_name,       
            email,
            password,
            gender,
            role,
            contactNumber
        } = req.body;
       
        let user = {
            avatar:req.file&&req.file.path? req.file.path:"",
            full_name,        
            email,
            password,
            gender,
            contactNumber,
            role
        };
        
        for (let [key, value] of Object.entries(user)) {
            if(key!='avatar')
            {
                if (!value || value == '') {
                    return res.json({
                        status: 0,
                        remarks:`${key} : is required`,
                    })
                }                 
            }
        }
        if (email && email != '' || contactNumber && contactNumber != '' ) {
            let query = { email: email };
            let phoneQuery = { contactNumber: contactNumber };
            let isAlreadyExist = await userModel.findOne(query);
            let contactNumberExist = await userModel.findOne(phoneQuery);
            if (isAlreadyExist || contactNumberExist) {
                return res.json({
                    status: 0,
                    remarks: "Email or Contact Number is already in use",
                })
            }
        }
        
      
        const add_user = new userModel(user);
        await add_user.save();
        let token = await jwt.generateToken({ id: add_user._id, email: add_user.email}, 'login');
        let audit_obj = {
            usr_id: add_user._id,
            audit_token: token,
            login_status: 1,
            audit_date: new Date(),
            login_time: moment().format("hh:mm"),
        }
        const user_audit = new auditModel(audit_obj);
        await user_audit.save();
        if(token){
            var finalData = JSON.stringify(add_user);
        finalData = JSON.parse(finalData);
        delete finalData["password"];
        delete finalData["access_token"];
        delete finalData["creationDate"];
        delete finalData["__v"];
        Object.assign(finalData, { access_token: token })

        return res.json({
            status: 1,
            remarks: 'register Successfully',
            data: finalData
        })
        }
        

    } catch (err) {
        console.log("Error in catch ----", err);
        let obj ={
            error_name:err,
            api_name:'/user/register'
        }
        const error_add = new errorModel(obj)
        await error_add.save();
        let error = errHandler.handle(err)
        return res.json({
            status: 0,
            remarks: error
        })
    }
}

const social_login = async(req , res)=>{
    const data = req.body;
    const schema = Joi.object({
        email : Joi.string().email().required(),
        device_token : Joi.string().required(),
        full_name : Joi.string().allow(""),
        gender : Joi.string().valid("Male" , "Female"),
        contactNumber : Joi.string(),
        avatar : Joi.string().allow("")
    })
    try{
        let value = await schema.validateAsync(data);
        if(!value.error){
            let user = await userModel.findOne({email: data.email  });
            if(user){
                if(user.user_type == "normal"){
                    return  res.status(400).json({
                        status: 0,
                        remarks: 'This email is not social login email',
                       
                    })
                }
                console.log("user" );
                let token = await jwt.generateToken({ id: user._id, email: user.email}, 'login');
                console.log("token" , token);
                let audit_obj = {
                    usr_id: user._id,
                    audit_token: token,
                    login_status: 1,
                    audit_date: new Date(),
                    login_time: moment().format("hh:mm"),
                }
                const user_audit = new auditModel(audit_obj);
                await user_audit.save();

                user["device_token"] = data.device_token;
                await user.save();
                var finalData = JSON.stringify(user);
                finalData = JSON.parse(finalData);
                delete finalData["password"];
                delete finalData["access_token"];
                delete finalData["creationDate"];
                delete finalData["__v"];
                Object.assign(finalData, { access_token: token })

                return res.json({
                    status: 1,
                    remarks: 'login successfully',
                    data: finalData
                })
            }else{
                let query = { email: data.email };
                let phoneQuery = { contactNumber: data.contactNumber };
                let isAlreadyExist = await userModel.findOne(query);
                let contactNumberExist = await userModel.findOne(phoneQuery);
                if (isAlreadyExist || contactNumberExist) {
                    return res.status(400).json({
                        status: 0,
                        remarks: "Email or Contact Number is already in use",
                    })
                }
            }
            let userObj = {
                avatar:data.avatar,
                full_name : data.full_name,        
                email : data.email,
                gender : data.gender,
                contactNumber : data.contactNumber,
                role : "User",
                user_type :"fb"
            };
            const add_user = new userModel(userObj);
            await add_user.save();
            let token = await jwt.generateToken({ id: add_user._id, email: add_user.email}, 'login');
            var finalData = JSON.stringify(add_user);
            finalData = JSON.parse(finalData);
            delete finalData["password"];
            delete finalData["access_token"];
            delete finalData["creationDate"];
            delete finalData["__v"];
            Object.assign(finalData, { access_token: token })

            return res.json({
                status: 1,
                remarks: 'login successfully',
                data: finalData
            })
        }
    }catch(err){
        let obj ={
            error_name:err,
            api_name:'/user/login'
        }
        const error_add = new errorModel(obj)
        await error_add.save();
        let error = errHandler.handle(err)
        return res.json(
            {
                status: 0,
                remarks: error
            })
    }
    
}

const login = async (req, res) => {
    try {
        let { email,password,role , device_token} = req.body;
        let cre = {
            email,
            password,
            role , 
            device_token
        }
        for (let [key, value] of Object.entries(cre)) {
            
            if (!value || value == '') {
                return res.json({
                    status: 0,
                    remarks:`${key} : is required`,
                })
            }
        }
        
        let query ={email :email,role:role}
        let result = await userModel.findOneAndUpdate(query , { $set : 
            {device_token : device_token}} , {new : true});
        if (result && result._id) {
            let compare_result = await service.comparePassword(req.body.password, result.password);

            let token = await jwt.generateToken({ id: result._id, email: result.email}, 'login');
            // await userModel.updateOne({'_id': result._id}, {$set: { access_token: token}}, {runValidators: true});

            let audit_obj = {
                usr_id: result._id,
                audit_token: token,
                login_status: 1,
                audit_date: new Date(),
                login_time: moment().format("hh:mm"),
            }
            const user_audit = new auditModel(audit_obj);
            await user_audit.save();
            if (compare_result && token) {
                
                var finalData = JSON.stringify(result);
                finalData = JSON.parse(finalData);
                let image  = finalData.avatar;
                
                delete finalData["password"];
                delete finalData["access_token"];
                delete finalData["creationDate"];
                delete finalData["__v"];
                delete finalData["avatar"]
                Object.assign(finalData, { access_token: token , avatar : `http://35.178.205.72:5013/${image}` })

                return res.json({
                    status: 1,
                    remarks: 'login successfully',
                    data: finalData
                })
            }
            else {
                return res.json({
                    status: 0,
                    remarks: 'Invalid Creditials'
                })
            }
        }
        return res.json({
            status: 0,
            remarks: 'Email is not registered please visit registration page'
        });
    } catch (err) {
        let obj ={
            error_name:err,
            api_name:'/user/login'
        }
        const error_add = new errorModel(obj)
        await error_add.save();
        let error = errHandler.handle(err)
        return res.json(
            {
                status: 0,
                remarks: error
            })
    }
}

const allUser = async(req , res)=>{
    try{
        let user = await userModel.find()
        res.status(200).json(user)
    }catch(err){
        console.log(err);
    }
}

const check_user = async(req , res)=>{
    const data = req.body;
    try{   
        console.log("data" , data); 
        let user_contact = await userModel.findOne({ contactNumber : data.contactNumber });
        let user_email = await userModel.findOne({  email : data.email});
        
        console.log("user" , user_contact);
        if(user_email && user_contact ){
            return res.status(200).json({
                status:0,
                remarks : "both Already in use"
            })
        }
        else if(user_email ){
            return res.status(200).json({
                status:0,
                remarks : "email Already in use"
            })
        }else if(user_contact){
            return res.status(200).json({
                status:0,
                remarks : "contact Number Already in use"
            })
        } 
        else{
            return res.status(200).json({
                status:1,
                remarks : "available"
            })
        }
    }catch(err){
        res.status(400).json({ error: true, message: err.message })
    }
}

const forget_password = async(req, res) => {
    let token = await crypto.randomBytes(3);
    token = token.toString("hex")
    console.log("t ", token)
    let obj = { reset_password_token: token, reset_password_expires: Date.now() + 86400000 };
    let user = await userModel.findOneAndUpdate({ email: req.body.email }, {
      $set: obj
    }, { new: true });
    console.log("user" , user , req.body.email);
    Email.sendMail(req.body.email, "Your password Reset Link is Here", `your password reset token is ${token}`, (iserr, err) => {
      if (!iserr) {
        res.status(200).json({ error: false, message: "Email has Successfully been sent" });
      } else {
        res.status(400).json({ error: true, message: err });
      }
    })
  }

  const change_password =async (req, res) => {
    const data = req.body;
    const schema = Joi.object({
      reset_password_token: Joi.string().required(),
      password: Joi.string().min(8).required(),
  
    })
    try {
      const value = schema.validateAsync(data);
      if (!value.error) {
        let user = await userModel.findOne({ reset_password_token: data.reset_password_token, reset_password_expires: { $gt: Date.now() } });
        if(!user){
            return res.status(400).json({
                status: 0,
                remarks:"Wrong Code"
            })
        }
        user.password = data.password;
        user.reset_password_token = undefined;
        user.reset_password_expires = undefined;
        user.save();
        res.status(200).json({
          error: false,
          message :"Sucessfully updated"  
        })
      }
    } catch (err) {
      res.status(400).json({ error: true, message: err.message })
    }
  };

  const change_user_password = async(req , res) =>{
      const data = req.body;
      const schema = Joi.object({
          old_password : Joi.string().required(),
          new_password : Joi.string().required(),
          user_id : Joi.string().required()
      })
      try{
        let value = await schema.validateAsync(data);
        if(!value.error)
        {   
            let user = await userModel.findById(data.user_id)
            console.log("user" , user);
            if(!user){
                return res.status(400).json({
                    status:0,
                    remarks : "user_id is incorrect"
                })
            }
            let check = await service.comparePassword(data.old_password , user.password);
            if(!check){
               return  res.status(400).json({
                    status:0,
                    remarks : "Old Password is wrong"
                })
            }
            user.password = data.new_password;
            // await service.incryptData(data.new_password);
            await user.save();
            res.status(200).json({
                status : 1,
                remarks : "Successfully Updated",
                data : user

            })
        }
      }catch(err){
        console.log(err);
        res.status(400).json({
            status : 0,
            remarks : err
        })
      }
  }
  const update_profile = async(req , res)=>{
      const data = req.body;
      const {id } = req.query;
      console.log("data" , data);
      const schema = Joi.object({
        avatar : Joi.string(),
        full_name : Joi.string(),
        gender : Joi.string().valid("Male" , "Female"),
        role : Joi.string().valid("User" , "Business"),
        
      })
      try{
        // let value =await schema.validateAsync(data);
        // if(!value.error){
            console.log("avatar" , req.file);
            if(req.file){
                data["avatar"] = req.file&&req.file.path? req.file.path:""
            }
           
            let user = await userModel.findByIdAndUpdate(id , {
                $set : data
            } ,{new : true});
            if(user){
                if(user.avatar){
                    user["avatar"] = `http://35.178.205.72:5013/${user.avatar}`
                }
                res.status(200).json({
                    status : 1,
                    remarks : "User Successfully Updated",
                    data : user
                })
            }
        // }
      }catch(err){
          console.log(err);
        res.status(400).json(err)
      }
  }

  const logout = async(req , res)=>{
      try{
        let user = await userModel.findOneAndUpdate({_id : req.user._id} , {
            $set : {device_token : ""}
        } , {new : true});
        res.status(200).json({
            status : 1,
            remarks : "User Successfully Updated",
            data : user
        })

      }catch(err){
        res.status(400).json(err)
      }
  }
module.exports = {
    register :register,
    login:login,
    allUser :allUser,
    forget_password : forget_password ,
    change_password : change_password,
    change_user_password : change_user_password,
    update_profile : update_profile,
    social_login : social_login,
    check_user: check_user,
    logout : logout
}