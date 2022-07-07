const { expect } = require('chai');

describe('test the error related features',()=>{
    describe('test the AppError class',()=>{
        const appError = require('./../wrappers/error/defaultAppError');
        const {DefaultAppError, _setMsg} = appError;

        it('should exports required members',()=>{

            expect(new DefaultAppError(0)).to.be.instanceOf(Error);
            expect(_setMsg).instanceOf(Function);
        });

        it('should set message correctly',()=>{
            expect(()=>_setMsg()).to.throw('required a valid code, but found undefined');
            expect(()=>_setMsg(null)).to.throw('required a valid code, but found null');
            expect(()=>_setMsg('a string')).to.throw('required a valid code, but found a string');
            expect(_setMsg(400)).to.be.a.string('Error!! Bad request');
        });

    });
});