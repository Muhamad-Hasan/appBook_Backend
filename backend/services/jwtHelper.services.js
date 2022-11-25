'use strict';

var jwt = require('jsonwebtoken');

const generateToken = async (payload,type) => {
    try {
        if(type=='forgot'){
            let token = await jwt.sign(payload, process.env.JWT_SECRET_KEY,{expiresIn:process.env.Token_Expiry_Time});
            return token;
        }
        else{
        let token = await jwt.sign(payload, process.env.JWT_SECRET_KEY);
        return token;}
    } catch (error) {
        return error
    }
}

const verifyToken = async (token) => {
    try {
        let result = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        return result;
    } catch (error) {
        return error;
    }
}

module.exports = {
    generateToken,
    verifyToken
}
