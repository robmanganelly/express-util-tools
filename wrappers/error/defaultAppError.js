/**
 * set the default message for the error class
 * @param { Number} code the HTTP Code Error
 * @returns  {String} a string to be used as a message  
 */
function setMessage(code){
    switch (code) {
        case 400:
            return 'Error!! Bad request';
        
        case 401:
            return 'Error!! Unauthorized';
    
        case 403:
            return 'Error!! Forbidden ';
        
        case 404:
            return 'Error!! Not Found';

        default:
            return 'Internal Server Error';
    }
}


/**
 * Creates a default Wrapper for an error in an Express.js application
 * @param  { Number } code The HTTP Error Code 
 * @param  { String } message The message for the Error
 * 
 */
class DefaultAppError extends Error {
    constructor(code, message){
        super(!message ? setMessage(code) : message);
        this.status = code;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {DefaultAppError};