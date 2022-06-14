
const {DefaultAppError} = require('./defaultAppError');

function _catchAsyncConstructor(errorClass){
    return (handler)=>{
        return (req, res, next)=>{
            handler(req, res, next).catch(
                error=>{
                    if (!error.status){ error = new errorClass(400, error.message);}
                    return next(error); 
                }
            );
        };
    };
}



module.exports.catchAsync = (handler)=>{
   return _catchAsyncConstructor(DefaultAppError)(handler);
};


module.exports.catchWithCustomError = (customErrorClass)=>{
    return _catchAsyncConstructor(customErrorClass);
}