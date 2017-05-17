'use strict';

const datapoints = Object.values(require('require-all')(__dirname + '/datapoints'));

let typeMap = {}; // { 'value': 0, 'switcher': 5, 'gps': 6, 'gen': 8, 'photo': 9 }
let dbMap = {};
datapoints.forEach(db => {
    let name = db.name;
    let id = db.id;
    typeMap[name] = id;
    typeMap[id] = name;
    dbMap[name] = dbMap[id] = db;
});

exports.typeMap = typeMap;
exports.dbMap = dbMap;
exports.dbs = datapoints;