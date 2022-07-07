const { should, expect } = require('chai');
const sinon = require('sinon');

const auxiliar =  require('./../wrappers/envelop/auxiliar');
const envelop =  require('./../wrappers/envelop/envelop');


describe('Testing envelopment feature', ()=>{

    describe('testing auxiliar',()=>{
        it('should export required auxiliar members',()=>{

            expect(auxiliar).to.have.property('msg');
            expect(auxiliar).to.have.property('status');
            expect(auxiliar.msg).to.be.instanceOf(Function);
            expect(auxiliar.status).to.be.instanceOf(Function);

        });

        it('should build a status',()=>{
            expect(()=>auxiliar.status()).to.throw();
            expect(()=>auxiliar.status('a')).to.throw();
            expect(auxiliar.status(200)).to.be.a.string('success');
            expect(auxiliar.status(201)).to.be.a.string('success');
            expect(auxiliar.status(400)).to.be.a.string('bad request error');
            expect(auxiliar.status(401)).to.be.a.string('unauthorized error');
            expect(auxiliar.status(403)).to.be.a.string('forbidden error');
            expect(auxiliar.status(404)).to.be.a.string('not found error');
            expect(auxiliar.status(500)).to.be.a.string('internal server error');
            expect(auxiliar.status(1000)).to.be.a.string('unhandled status "1000"');
        });

        it('should build a default message',()=>{
            expect(()=>auxiliar.msg()).to.throw();
            expect(()=>auxiliar.msg('message')).to.throw();
            expect(auxiliar.msg(200,'')).to.be.a.string('resource sent successfully');
            expect(auxiliar.msg(201,'')).to.be.a.string('successfully');
            expect(auxiliar.msg(400,'')).to.be.a.string('error');
            expect(auxiliar.msg(401,'')).to.be.a.string('error');
            expect(auxiliar.msg(403,'')).to.be.a.string('error');
            expect(auxiliar.msg(404,'')).to.be.a.string('error');
            expect(auxiliar.msg(500,'')).to.be.a.string('error');
            expect(auxiliar.msg(200,'message')).to.be.a.string('message');
        });
    });

    describe('testing envelop core funtions',()=>{

        it('should export member',()=>{

            expect(envelop).to.have.property('envelop');
            expect(envelop.envelop).to.be.instanceOf(Function);

        });

        it('should envelop and serialize payload',()=>{

            res = {status: ()=>{}, json: ()=>{} };
            sinon.stub(res,'status');
            sinon.stub(res,'json');
            res.status.returns(res);
            res.json.callsFake(o=>{res.body=o;return res;});


            //mocking response

            envelop.envelop(res,200,{foo:'bar'});

            expect(res.body).to.have.property('status');
            expect(res.body.status).to.be.string('success');

            expect(res.body).to.have.property('code');
            expect(res.body.code).to.be.equal(200);

            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('foo','bar');

            expect(res.body).to.have.property('message');
            expect(res.body.message).to.be.a.string('success');




        });

    });


});

// !note
// expect(middle.bind(this,req,{},()=>{}))