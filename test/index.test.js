const { expect, should } = require('chai');

const {
    mailer,
    AppError,
    bodyFilter, 
    catchAsync ,
    catchWithCustomError, 
    envelop, 
    topLevel } = require('./../index');

describe('Testing for all members to be available',()=>{
 
    it('should export AppError ', ()=>{        
        expect(new AppError(0)).instanceOf(Error);
    });
    it('should export mailer ', ()=>{        
        expect(mailer).instanceOf(Object);
        expect(Object.keys(mailer).length).to.be.equal(6);
        Object.keys(mailer).forEach(k=>expect(mailer[k]).to.be.not.equal(undefined));
        Object.keys(mailer).forEach(k=>expect(mailer[k]).to.be.not.equal(null));
    });
    it('should export bodyFilter ', ()=>{        
        expect(bodyFilter).instanceOf(Function);
    });
    it('should export catchWithCustomError ', ()=>{        
        expect(catchWithCustomError).instanceOf(Function);
    });
    it('should export catchAsync ', ()=>{        
        expect(catchAsync).instanceOf(Function);
    });
    it('should export envelop ', ()=>{        
        expect(envelop).instanceOf(Function);
    });
    it('should export topLevel ', ()=>{        
        expect(topLevel).instanceOf(Function);
    });

});