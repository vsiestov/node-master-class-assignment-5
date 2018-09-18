const lib = require('../../app/lib');
const assert = require('assert');


describe('Second test case in the folder', () => {
    it('should check correct input params', () => {
        const result = lib.find(null, null);

        assert.equal(result, null);
    });
});