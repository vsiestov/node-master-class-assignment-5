## Simple test runner

#### How to run tests

```
 node test/runner.js test/lib.spec.js
```

or

```
node test/runner.js test/nested/*.spec.js
```

#### Basic usage

```
    describe('Test suite description', function () {
        before(fucntion () {
            // This function will be called before all tests in this test suite
        });

        beforeEach(function () {
            // This function will be called before each test case in this test suite
        });

        after(function () {
            // This function will be called after all test cases in this test suite
        });

        afterEach(function () {
            // This function will be called after each test case in this test suite
        });

        // Example of a test case
        it('Test case description', function () {
            assert.ok(1 === 1);
        });
    });
```

Test suite can have nested test suites inside

```
    describe('Test suite description', function () {
        ...

        describe('Nested suite 1', function () {
            ...

            describe('Nested suite 2', function () {
                ...
            });

            ...
        });

        ...
    });
```