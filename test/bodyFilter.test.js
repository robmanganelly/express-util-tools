const { expect } = require('chai');
const { bodyFilter } = require('./../bodyFilter/bodyFilter');


describe('Testing bodyFilter feature',()=>{
    it('should correctly filter an object',()=>{
        const primaryObject = Object.create({foo:'bar', foo2:'bar2'});

        const filteredObject = bodyFilter(primaryObject,['foo']);

        expect(filteredObject).to.be.deep.equal({foo: 'bar'});
    });
});

