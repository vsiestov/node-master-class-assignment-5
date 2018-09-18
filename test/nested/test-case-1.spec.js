const lib = require('../../app/lib');
const assert = require('assert');


describe('First test case in the folder', () => {
    it('should check correct input params', () => {
        const result = lib.findIndex(null, null);

        assert.equal(result, -1);
    });
});