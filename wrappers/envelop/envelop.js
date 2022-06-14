const build = require('./auxiliar');


/**
 * This function wraps and serialize the server response.
 * @param { HttpResponse } res 
 * @param { Number } httpStatus 
 * @param { {data: Object} | {error: Error}  } payload 
 * @param { String | undefined } message 
 * @returns {HttpResponse} 
 */
const envelop = (res, httpStatus, payload, message)=>{
    
    return res.status(httpStatus).json({
        status: build.status(httpStatus),
        code: httpStatus,
        data:{data: payload.data, error:payload.error},
        message: build.msg(httpStatus,message)
    });
};


module.exports = {envelop};