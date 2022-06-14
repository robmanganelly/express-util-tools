const {catchAsync, catchWithCustomError} = require('./wrappers/error/error');
const { envelop }  = require('./wrappers/envelop/envelop');
const { DefaultAppError } = require('./wrappers/error/defaultAppError');

module.exports = { catchAsync ,catchWithCustomError, envelop, AppError: DefaultAppError };
