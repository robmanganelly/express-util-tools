const { DefaultAppError } = require('./defaultAppError');
const { envelop } = require('./../envelop/envelop');

/**
 * 
 * @param { Object } req 
 * @param { Object } res 
 * @param { Object } next 
 * @param { Object } err 
 * @returns 
 */
const topLevel = (err, req, res, next)=>{

    let error;

    error = (!err.status)? new DefaultAppError(500) : err;
    console.log(process.env.NODE_ENV === 'production' ? 'error': error);

    let devError = {message: error.message, status:error.status, stack: err.stack };
    let prodError = {message: error.message, status:error.status};
    
    return envelop(res,error.status, 
        {error: process.env.NODE_ENV === 'production' ? prodError : devError },
        error.message
        );

};

module.exports = { topLevel};