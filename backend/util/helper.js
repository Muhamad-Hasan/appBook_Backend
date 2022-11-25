/**
 * Created by Muhammad Mateen on 05/07/2018.
 */
'use strict';

// 500,          //unexpected error or database error (Internal Server Error)
// 409,          //Name already exists (Conflict)
// 404,          //Not found
// 403,			//The request was valid, but the server is refusing action
// 401,          //UnAuthorized Access Attempt
// 400,          //incomplete arguments (Bad Request)
// 200,          //Success or update
// 201,           //Created
// 204			//No Content


module.exports = {
    extendObject: extendObject,
    extendDate: extendDate,
    convertToDate: convertToDate,
    convertToGMT: convertToGMT,
    getCharacter: getCharacter,
    toLower: toLower,
    validateArray: validateArray,
    MongooseErrorMessages: MongooseErrorMessages,
    mappingModel: mappingModel,
    isNullOrUndefined: isNullOrUndefined,
    validateObjNullOrUndefined: validateObjNullOrUndefined,
    fetchUploadedFilePath: fetchUploadedFilePath,
    fetchS3UploadedFilePath: fetchS3UploadedFilePath,
    validateNumberRange: validateNumberRange
}

function extendObject(targetObj, sourceObj) {
    for (var i in sourceObj) {
        targetObj[i] = sourceObj[i];
    }
    return targetObj;
};

//Extend current Date to supplied days & return timestamp
function extendDate(days) {
    var date = new Date();
    return date.setDate(date.getDate() + days);
};

//Convert Time stamp into Date
function convertToDate(timeStamp) {
    return new Date(timeStamp);
};

//Covert Date into GMT
function convertToGMT(date) {
    return new Date().toUTCString();
};

function getCharacter(str, totalCharacters, isUpperCase) {
    var characters = str.substring(0, totalCharacters);
    if (isUpperCase) {
        characters.toUpperCase();
    }
    return characters;
};

// Convert String into Lower Case
function toLower(data) {
    return data.toLowerCase();
};

// Validate Regular expression pattern
function validateRegularExpression(data, pattern) {
    return pattern.test(data)
};

function validateArray(arr) {
    return arr !== (null || undefined || '')
};
//Fetch Error msg of mongoose
function MongooseErrorMessages(err) {
    return Object.keys(err.errors).map(function (key) {
        return err.errors[key] = err.errors[key].message;
    })
};

function mappingModel(obj, model) {
    let hashObj = {};
    Object.keys(obj).forEach(function (key) {
        if (model.hasOwnProperty(key)) {
            hashObj[model[key]] = obj[key];
        }
    });
    return hashObj;
};

function isNullOrUndefined(value) {
    if (value === undefined || value === null) {
        return true;
    }
    return false;
};

// Validate Given object Not Null and Undefined
function validateObjNullOrUndefined(obj) {
    for (let key in obj) {
        if (obj[key] == null || obj[key] == "undefined") {
            return false;
            break;
        }
    }
    return true;
}

function fetchUploadedFilePath(files, fieldname, options) {
    if (options.type == 'string') {
        return files[fieldname][0].path;
    } else if (options.type == 'array') {
        return files[fieldname].map(file => file.path);
    }
}

function fetchS3UploadedFilePath(files, fieldname) {
    if (!files) {
        return "";
    }
    let path = files.filter(item => item.fieldname == fieldname).map(file => file.location);
   
    return path;
}

function validateNumberRange(item, rangeFrom, rangeTo) {
    if (rangeFrom >= item.from && rangeFrom <= item.to && rangeTo >= item.from && rangeTo <= item.to) {
        return true;
    }
    else {
        return false;
    }
}