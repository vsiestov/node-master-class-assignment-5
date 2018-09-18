const path = require('path');

/**
 * Test suite class
 *
 * @class
 */
class TestSuite {
    constructor(title, parent, callback) {
        this.title = title;
        this.beforeList = [];
        this.beforeEachList = [];
        this.afterEachList = [];
        this.afterList = [];
        this.cases = [];
        this.parent = parent;
        this.callback = callback;
        this.children = [];
    }

    total() {
        return this.cases.length;
    }

    run() {
        // Send first callback for "describe" function
        this.callback.call(this);

        // After callback processed all hooks must be filled by test suite

        const cases = this.cases;
        const casesCount = cases.length;

        // If there is no any cases, then we have nothing to do
        if (!casesCount) {
            return;
        }

        const beforeList = this.beforeList;
        const beforeListCount = beforeList.length;

        const afterList = this.afterList;
        const afterListCount = afterList.length;

        const beforeEachList = this.beforeEachList;
        const beforeEachListCount = beforeEachList.length;

        const afterEachList = this.afterEachList;
        const afterEachListCount = afterEachList.length;

        for (let i = 0; i < beforeListCount; i++) {
            beforeList[i]();
        }

        // Walk through the test cases and run before/after each functions
        for (let i = 0; i < casesCount; i++) {
            for (let be = 0; be < beforeEachListCount; be++) {
                beforeEachList[be]();
            }

            try {
                cases[i].callback();
                cases[i].status = 'success';
            } catch ($exception) {
                cases[i].status = 'fail';
                cases[i].error = $exception;
            }

            for (let ae = 0; ae < afterEachListCount; ae++) {
                afterEachList[ae]();
            }
        }

        for (let i = 0; i < afterListCount; i++) {
            afterList[i]();
        }

    }

    before(callback) {
        this.beforeList.push(callback);
    }

    beforeEach(callback) {
        this.beforeEachList.push(callback);
    }

    afterEach(callback) {
        this.afterEachList.push(callback);
    }

    after(callback) {
        this.afterList.push(callback);
    }

    it(title, callback) {
        this.cases.push({
            title,
            callback
        });
    }
}

/**
 * This class initializes global test suite handlers, make a queue of test suites and run them
 */
class TestQueue {
    /**
     * Set global functions
     */
    initGlobals() {
        global.describe = (...args) => {
            this.describe(...args);
        };

        global.before = (...args) => {
            this.before(...args);
        };

        global.after = (...args) => {
            this.after(...args);
        };

        global.beforeEach = (...args) => {
            this.beforeEach(...args);
        };

        global.afterEach = (...args) => {
            this.afterEach(...args);
        };

        global.it = (...args) => {
            this.it(...args);
        };
    }

    /**
     *
     * @param list
     */
    run(list) {
        const count = list.length;

        for (let i = 0; i < count; i++) {
            require(path.resolve(list[i]));
        }

    }

    constructor() {
        this.stack = [];
        this.finished = [];
        this.suite = null;
    }

    /**
     * Add a new test suite and run test inside of it
     * @param {String} title
     * @param {Function} callback
     */
    describe(title, callback) {
        this.stack.push(new TestSuite(title, this.suite, callback));

        const lastIndex = this.stack.length - 1;

        this.suite = this.stack[lastIndex];

        this.suite.run();

        // After execution test is removed from the queue

        this.finished.push(this.suite);
        this.stack.splice(lastIndex, 1);

        // If this test suite was nested, we need to restore its parent
        if (this.suite.parent) {
            this.suite = this.suite.parent;
        }

        if (lastIndex === 0) {
            this.suite = null;
        }
    }

    before(callback) {
        const suite = this.stack[this.stack.length - 1];

        suite.before(callback);
    }

    after(callback) {
        const suite = this.stack[this.stack.length - 1];

        suite.after(callback);
    }

    beforeEach(callback) {
        const suite = this.stack[this.stack.length - 1];

        suite.beforeEach(callback);
    }

    afterEach(callback) {
        const suite = this.stack[this.stack.length - 1];

        suite.afterEach(callback);
    }

    it(title, callback) {
        const suite = this.stack[this.stack.length - 1];

        suite.it(title, callback);
    }

    /**
     * console printing functions for test suites reports
     */
    get ui() {
        return {
            indentation: (count) => {
                const result = [];

                for (let i = 0; i < count; i++) {
                    result.push(' ');
                }

                return result.join('');
            },

            line: (lines = 1) => {
                for (let i = 0; i < lines; i++) {
                    console.log('');
                }
            },

            title: (indentation = 0, message) => {
                console.log(`${this.ui.indentation(indentation)}${message}`);
            },

            success: (indentation = 0, message) => {
                console.log('\x1b[32m%s\x1b[0m', `${this.ui.indentation(indentation)}  \u2714 ${message}`);
            },

            fail: (indentation = 0, message) => {
                console.log('\x1b[31m%s\x1b[0m', `${this.ui.indentation(indentation)}  \u2715 ${message}`);
            }
        };
    }

    /**
     * Print suite including nested suites
     *
     * @param {Number} indentation - line offset
     * @param {TestSuite} suite - chosen suite
     */
    printSuite(indentation, suite) {
        const cases = suite.cases;
        const casesCount = cases.length;

        if (!casesCount) {
            return;
        }

        this.ui.title(indentation, suite.title);

        for (let j = 0; j < casesCount; j++) {
            if (cases[j].status === 'success') {
                this.ui.success(indentation, cases[j].title);
            } else {
                this.ui.fail(indentation, cases[j].title);
            }
        }

        this.ui.line();

        const children = suite.children || [];
        const childrenCount = children.length;

        for (let i = 0; i < childrenCount; i++) {
            this.printSuite(indentation + 4, children[i]);
        }

    }

    /**
     * This function reorganize the list of suite adding children list for parent suites
     *
     * @param {Array<TestSuite>} list - the list of test suites
     * @returns {Array<TestSuite>} - reorganized list
     */
    reorganizeChildren(list) {
        const count = list.length;
        const result = [];

        for (let i = 0; i < count; i++) {
            if (list[i].parent) {
                if (!list[i].parent.children) {
                    list[i].parent.children = [];
                }

                list[i].parent.children.push(list[i]);
            } else {
                result.push(list[i]);
            }
        }

        return result;
    }

    printReport() {

        const list = this.reorganizeChildren(this.finished);
        const count = list.length;

        this.ui.line();

        for (let i = 0; i < count; i++) {
            this.printSuite(0, list[i]);
        }
    }

}

const queue = new TestQueue();

// Set global functions which must be available for test suites (before, after, (before/after)Each, describe, it)
queue.initGlobals();

// Read files from cli arguments and run tests
queue.run(process.argv.slice(2));
queue.printReport();