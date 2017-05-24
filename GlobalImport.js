'use strict';

exports = module.exports = function (scope, ref) {
    for (let key of Object.keys(ref)) {
        scope[key] = ref[key];
    }
}
