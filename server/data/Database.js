'use strict';

const db = require('./Schema');

exports.user = require('./User');
exports.device = require('./Device');
exports.sensor = require('./Sensor');
exports.datapoint = require('./Datapoint');

exports.initialize = () => {
    exports.user.initialize();
    exports.device.initialize();
    exports.sensor.initialize();
    exports.datapoint.initialize();
}

// just for debugging
exports.dropAll = () => {
    db.run('DROP TABLE IF EXISTS user');
    db.run('DROP TABLE IF EXISTS info');
    db.run('DROP TABLE IF EXISTS sensor');
    db.run('DROP TABLE IF EXISTS value_data');
};