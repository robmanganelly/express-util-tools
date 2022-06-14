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
const topLevel = (req, res, next, err)=>{

    let __error;

    __error =  !err.status ? new DefaultAppError(500) : err;

    return envelop(res,err.status, {error:__error},__error.message);

}

module.exports = { topLevel};