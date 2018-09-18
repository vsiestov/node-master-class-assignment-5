
const findIndex = (list, obj) => {

    if (!list || !(list instanceof Array) || !obj || typeof obj !== 'object') {
        return -1;
    }

    const count = list.length;

    for (let i = 0; i < count; i++) {
        for (const item in obj) {

            if (obj.hasOwnProperty(item)) {
                if (list[i][item] === obj[item]) {
                    return i;
                }
            }

        }
    }
};

const find = (list, obj) => {
    const index = findIndex(list, obj);

    if (index === -1) {
        return null;
    }

    return Object.assign({}, list[index]);
};

const immutable = {
    array: {
    },
    object: {
    }
};

immutable.array.push = (list, item) => {
    return [...list, item];
};

immutable.array.remove = (list, index) => {
    return list.slice(0, index).concat(list.slice(index + 1));
};

immutable.array.unshift = (list, item) => {
    return [item, ...list];
};

immutable.array.push = (list, item) => {
    return [...list, item];
};

immutable.array.update = (list, item, index) => {
    return [...list.slice(0, index), item, ...list.slice(index + 1)];
};

immutable.array.pushList = (list, items) => {
    return [...list, ...items];
};

immutable.array.unshiftList = (list, items) => {
    return [...items, ...list];
};

immutable.object.clone = (source) => {
    return Object.assign({}, source);
};

immutable.object.add = (source, obj) => {
    return Object.assign({}, source, obj)
};

immutable.object.remove = (source, obj) => {
    const clone = immutable.object.clone(source);

    for (const item in obj) {

        if (obj.hasOwnProperty(item) && clone.hasOwnProperty(item)) {
            delete clone[item];
        }

    }

    return clone;
};

exports.findIndex = findIndex;
exports.find = find;
exports.immutalbe = immutable;