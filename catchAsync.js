const createError = require("http-errors");


module.exports = function catchAsync(handler){
    return (req, res, next)=>{
        handler(req, res, next).catch(
            error=>{
                
                if (!error.status){ error = new createError(400, error.message);}
                return next(error);
            }
        );
    };
};