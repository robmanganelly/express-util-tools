const { expect } = require('chai');
const { describe, it} = require('mocha');
const email = require('./../email/email');


describe('Testing email feature',()=>{
    it('should export required members',()=>{
        expect(email).to.have.property('basicEmailOptions');
        expect(email).to.have.property('basicTransportOptions');
        expect(email).to.have.property('create');
        expect(email).to.have.property('sendGridTransportOptions');
        expect(email).to.have.property('test');
    });


    describe('testing basicTransportOptions',()=>{
        const options = email.basicTransportOptions;
        const mockOptWithKeys = {service: 'foo', auth: {auth_key: 'bar'}};
        const mockOptWithPass = {service: 'foo', auth: {user: 'bar', pass: 'baz'}};

        it('should be a function',()=>{
            expect(options).instanceOf(Function);
        });

        it('should return correct options',()=>{
            expect(()=>options()).to.throw('incorrect options');
            expect(()=>options('foo')).to.throw('incorrect options');
            expect(()=>options(['foo','bar'])).to.throw('incorrect options');
            expect(()=>options({foo:'foo'},'bar')).to.throw('incorrect options');
            expect(options('foo','bar')).to.be.deep.equal(mockOptWithKeys);
            expect(options('foo','bar','baz')).to.be.deep.equal(mockOptWithPass);
            expect(options('foo','bar','baz','mute')).to.be.deep.equal(mockOptWithPass);

        });
    });

    // describe('testing basicEmailOptions',()=>{
    //     const options = email.basicEmailOptions;
        
    //     it()
    // });
})