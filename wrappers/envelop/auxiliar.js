function _msgBuilder(status, message){
    
    if (!!message && typeof message === "string"){
        return message;
    }

    else if (typeof status !== "number"){
        return "wrong status and unknown message";
    }

    else {
        
        let msg = "";
        switch (status) {
            case 200:
                msg = "resource sent successfully";
                break;
            case 201:
                msg = "resource created successfully";
                break;
            
            case 400:
                msg = "error, bad request";
                break;
            case 401:
                msg = "error, not enough privileges ";
                break;
            
            case 403:
                msg = "error, forbidden!!";
                break;
            
            case 404:
                msg = "error, resource not found";
                break;
            
            case 500:
                msg = "internal server error";
                break;


            default:
                msg = `unknown status "${status}" and undefined message`;
                break;
        }
        return msg;
    }
}

function _statusBuilder(code){

    let __status = "";
   
    switch (code) {
        case 200:
            __status = "success";
            break;
        case 201:
            __status = "success";
            break;
        
        case 400:
            __status = " bad request error";
            break;
        case 401:
            __status = "unauthorized error ";
            break;
        
        case 403:
            __status = "forbidden error ";
            break;
        
        case 404:
            __status = "not found error";
            break;
        
        case 500:
            msg = "internal server error";
            break;


        default:
            __status = `unhandled status "${code}"`;
            break;
    }
    return __status;
    
}

module.exports = { msg: _msgBuilder, status: _statusBuilder};