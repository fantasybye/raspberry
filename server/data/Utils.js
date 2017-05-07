'use strict';

Object.prototype.forEach = function (callback) {
    if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');

    let func = callback.length === 1
        ? k => callback({ key: k, value: this[k] })
        : k => callback(k, this[k]);

    Object.keys(this).forEach(func);
}

exports.toTag = tags => {
    return tags ? (tags instanceof Array ? tags.join(',') : tags.toString()) : null;
}

// Object.prototype.map = function* (mapper) {
//     let func = get.call(this, mapper);
//     for (let k of Object.keys(this)) {
//         yield func(k);
//     }
// }

// Array.prototype.map = function* (mapper) {
//     for (let v of this) {
//         yield mapper(v);
//     }
// }

// exports.toArray = function (generator) {
//     let result = [];
//     let iter = generator.next();
//     while(!iter.done) {
//         result.push(iter.value);
//         iter = generator.next();
//     }
//     return result;
// }

function get(func) {
    return func.length === 1
        ? k => func({ key: k, value: this[k] })
        : k => func(k, this[k]);
}
