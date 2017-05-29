'use strict';

const deasync = require('deasync');

Object.prototype.forEach = function (callback) {
    if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');

    let func = callback.length === 1
        ? k => callback({ key: k, value: this[k] })
        : k => callback(k, this[k]);

    Object.keys(this).forEach(func);
};

exports.toTag = tags => {
    return tags ? (tags instanceof Array ? tags.join(',') : tags.toString()) : null;
};

exports.sync = (func, ...args) => {
    let finished, result;

    if (typeof func === 'function') {
        result = func.apply(null, args);
    } else {
        result = func;
    }

    if (result instanceof Promise) {
        result.then(res => {
            finished = true;
            result = res;
        });

        while (!finished) {
            deasync.runLoopOnce();
        }
    }

    return result;
};

exports.checkResult = async (res) => {
    if (res instanceof Promise) {
        res = await res;
    }
    if (res === undefined || res.changes === 0) {
        throw { 'ERROR': 'NO PERMISSION' };
    }
};

exports.getApiKey = req => {
    return req.get('U-ApiKey');
};

exports.controller = (interceptor, ...actions) => {
    return { interceptor: interceptor, actions: actions };
};

exports.action = (method, path, action) => {
    return { method: method, path: path, action: action };
};

// better?
// const methods = ['get', 'post', 'put', 'delete'];
// for (let method of methods) {
//     exports[method] = (path, action) => exports.action(method, path, action);
// }

exports.get = (path, action) => exports.action('get', path, action);
exports.post = (path, action) => exports.action('post', path, action);
exports.put = (path, action) => exports.action('put', path, action);
exports.delete = (path, action) => exports.action('delete', path, action);

const timeZoneOffset = new Date().getTimezoneOffset() * 60000;

exports.toTime = function (isoTime) {
    let time = isoTime
        ? (new Date(isoTime).getTime() + timeZoneOffset)
        : new Date().getTime();
    return Math.floor(time / 1000);
}

exports.toISOTime = function (time) {
    return new Date(time * 1000 - timeZoneOffset)
        .toISOString()
        .replace(/\..*$/, '');
}
