const {catchAsync, catchWithCustomError} = require('./wrappers/error/error');
const { envelop }  = require('./wrappers/envelop/envelop');
const { DefaultAppError } = require('./wrappers/error/defaultAppError');
const {topLevel} = require('./wrappers/error/global');

module.exports = { 
    catchAsync ,
    catchWithCustomError, 
    envelop, 
    AppError: DefaultAppError, 
    topLevel 
};
