const assert = require('assert');
const lib = require('../app/lib');

describe('General test suite of the lib', () => {

    let list;

    // Init an empty array | just for this test/demo of the runner hooks
    before(() => {
        list = [];
    });

    beforeEach(() => {
        const count = 5;

        for (let i = 0; i < count; i++) {
            list.push({
                id: i,
                title: `Number ${i + 1}`
            });
        }
    });

    afterEach(() => {
        console.log('You can see it after each test case');
    });

    after(() => {
        console.log('This is the last step of this suite');
    });

    it('Find an index of the array by an object', () => {
        const index = lib.findIndex(list, {
            id: 3
        });

        assert.equal(index, 3);
    });

    it('Find an element of the array by an object', () => {
        const obj = lib.find(list, {
            id: 1
        });

        assert.deepEqual(obj, {
            title: 'Number 2',
            id: 1
        });
    });

    it('Try to find an element of the array by an object and fail', () => {
        const obj = lib.find(list, {
            id: 1
        });

        assert.equal(obj, list[1]);
    });

    it('Check before each hook', () => {
        assert.equal(list.length, 20);
    });

    describe('Immutable Arrays', () => {

        const list = [];

        beforeEach(() => {
            for (let i = 0; i < 10; i++) {
                list.push({
                    id: i,
                    name: `Random number${Math.random() * 10}`
                });
            }
        });

        afterEach(() => {
            list.length = 0;
        });

        it('should add array item', () => {
            const obj = {
                id: 'new id',
                name: 'new name'
            };

            const result = lib.immutalbe.array.push(list, obj);

            list.push(obj);

            assert.equal(result[0].id, list[0].id);
            assert.equal(list[list.length - 1], result[result.length - 1]);
            assert.equal(list.length, result.length);
            assert.notEqual(result, list);
        });

        it('should remove array item', () => {
            const result = lib.immutalbe.array.remove(list, 0);

            // Test after each and before each functions to reset the source list and check immutable remove function
            assert.equal(result.length, 9);
        });
    });

    describe('Immutable Objects', () => {

        it('should clone an object', () => {
            const obj = {
                a: 1,
                b: 2
            };

            const result = lib.immutalbe.object.clone(obj);

            assert.equal(obj.a, result.a);
            assert.equal(obj.b, result.b);
            assert.notEqual(obj, result);
            assert.deepEqual(obj, result);
        });

        it('should fail this case to check the report', () => {
            const obj = {
                a: 1,
                b: 2
            };

            const result = lib.immutalbe.object.add(obj, {
                c: 3
            });

            assert.equal(result.c, 3);
            assert.equal(obj, result);
        });

        // For test purpose to see this suite to be nested as 3-d level
        describe('Immutable 3-d nested level', () => {
            it('should be ok', () => {
                assert.ok(2 === 2);
            });
        });
    });

});

// For test report purpose
describe('Another one test suite', () => {
    it('should check boolean expression', () => {
        assert.ok(1 === 1);
    });
});
