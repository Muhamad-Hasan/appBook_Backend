handle = (err) => {
    if(err.name){
        switch(err.name){
            case 'ValidationError':
                return validationErrors(err);
                break;
            case 'TokenExpiredError':
                return tokenError(err);
                break;    
            case 'MongoError':
                return mongoErrors(err);
                break;
                case 'CastError':
                return castErrors(err);
            default:
                return unexpectedError(err);
            }
    }else{
        return unexpectedError(err);
    }
}

 mongoErrors = (err) => {
    var error = '';
    try{
        if(err.code && err.code == 11000){
            var msg = err.errmsg.split('_1 dup key');
            msg = msg[0];
            msg = msg.split(' ');
            var propertyName = msg[msg.length-1];
            error=`This ${propertyName} is already in use.`;
            return error;
        }
    }catch(error){
        console.log("Unexpected Error : -------------> ",err);
        errors.push("Unexpected Error");
        return [errors, -5];
    } 
}

validationErrors = (err) => {
    var errors = [];
    for(var propertyName in err.errors){
        errors.push(err.errors[propertyName].message);
    }
    return errors;
}

castErrors = (err) => {
    console.log("Cating Error : -------------> ",err);
    var errors = ["Cast to embedded failed. Please provide correct values"];
    return [errors, 0];
}

tokenError = (err) => {
  var error='Password reset link has expired'
  return error;
}
unexpectedError = (err) => {
    console.log("Unexpected Error : -------------> ",err);
    var errors = ["Unexpected Error"];
    return [errors, -5];
}
module.exports={
    handle,
    mongoErrors,
    tokenError,
    validationErrors,
    castErrors,
    unexpectedError
}