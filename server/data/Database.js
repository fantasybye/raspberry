'use strict';

const db = require('./Schema');

exports.user = require('./User');
exports.room = require('./Room');
exports.device = require('./Device');
exports.sensor = require('./Sensor');
exports.datapoint = require('./Datapoint');

// just for debugging
exports.dropAll = () => {
    db.run('DROP TABLE IF EXISTS user');
    db.run('DROP TABLE IF EXISTS info');
    db.run('DROP TABLE IF EXISTS sensor');
    db.run('DROP TABLE IF EXISTS value_data');
};