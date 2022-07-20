const nodemailer = require('nodemailer');
const { expect, assert } = require('chai');
const { describe, it} = require('mocha');
const email = require('./../email/email');
const Mail = require('nodemailer/lib/mailer');



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
    
    describe('testing sendGridTransportOptions',()=>{
        const options = email.sendGridTransportOptions;
        const mockOptWithKeys = {service: 'sendGrid', auth: {auth_key: 'bar'}};
        const mockOptWithPass = {service: 'sendGrid', auth: {user: 'bar', pass: 'baz'}};
        
        it('should be a function',()=>{
            expect(options).instanceOf(Function);
        });

        it('should return correct options',()=>{
            expect(()=>options()).to.throw('incorrect options');
            expect(()=>options(['foo'])).to.throw('incorrect options');
            expect(()=>options(['foo'],'bar')).to.throw('incorrect options');
            expect(options('bar')).to.be.deep.equal(mockOptWithKeys);
            expect(options('bar','baz')).to.be.deep.equal(mockOptWithPass);
            
        });
    });

    describe('testing basicEmailOptions', () => { 
        const options = email.basicEmailOptions;

        it('should be a function',()=>{
            expect(options).instanceOf(Function);
        });

        it('should export correct options',()=>{

            const textOptions = {from: 'foo', to: 'bar', text: 'baz'};
            const emailOptions = {from: 'foo', to: 'bar', html: 'baz'};

            expect(()=>options()).to.throw('incorrect options');
            expect(()=>options(1)).to.throw('incorrect options');
            expect(()=>options([1],'foo')).to.throw('incorrect options');
            expect(()=>options(undefined)).to.throw('incorrect options');
            expect(()=>options('foo','bar')).to.throw('incorrect options');
            expect(options('foo','bar',undefined,'baz')).to.be.deep.equal(textOptions);
            expect(options('foo','bar',undefined,null,'baz')).to.be.deep.equal(emailOptions);
        });
     });
    
    describe('testing class Mailer as create', () => {
        
        const {create, basicTransportOptions ,sendGridTransportOptions} = email;
        const emptyInstance = new create();
        const mailInstance = new create(basicTransportOptions('foo','bar'));
        const sendGridInstance = new create(sendGridTransportOptions);

        it('shound create an instance',()=>{
            expect(sendGridInstance).to.be.instanceOf(create);
        });

        it('should create a void instance with empty properties',async ()=>{
            expect(emptyInstance).to.be.instanceOf(create);
            expect(emptyInstance.transport).to.be.equal(null);
            expect(await emptyInstance.send()).to.be.equal(null);
        });

        it('should create a non void instance with a real transport',()=>{  
            expect(mailInstance).to.be.instanceOf(create);
            expect(mailInstance.transport).to.be.instanceOf(Mail);

        });
        it('should trigger sending emails logic',async ()=>{
                        
        });
    });
});