const build = require('./auxiliar');


/**
 * This function wraps and serialize the server response.
 * @param { Object } res 
 * @param { Number } httpStatus 
 * @param { Object  } payload 
 * @param { String | undefined } message 
 * @returns { } 
 */
const envelop = (res, httpStatus, data, message)=>{
    
    return res.status(httpStatus).json({
        status: build.status(httpStatus),
        code: httpStatus,
        data,
        message: build.msg(httpStatus,message)
    });
};


module.exports = {envelop};