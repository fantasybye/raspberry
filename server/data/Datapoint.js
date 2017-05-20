'use strict';

const sensor = require('./Sensor');
const helper = require('./SensorHelper');

// support value type, switcher type and generic type
exports.initialize = () => { };

exports.add = (apiKey, deviceId, sensorId, data, success, fail) => {
    getDataBase(apiKey, deviceId, sensorId, database => {
        database.add(apiKey, deviceId, sensorId, data, success, fail);
    }, fail);
};

exports.get = (apiKey, deviceId, sensorId, key, success, fail) => {
    getDataBase(apiKey, deviceId, sensorId, database => {
        database.get(apiKey, deviceId, sensorId, key, success, fail);
    }, fail);
};

exports.update = (apiKey, deviceId, sensorId, key, value, success, fail) => {
    getDataBase(apiKey, deviceId, sensorId, database => {
        database.update(apiKey, deviceId, sensorId, key, value, success, fail);
    }, fail);
};

exports.delete = (apiKey, deviceId, sensorId, key, success, fail) => {
    getDataBase(apiKey, deviceId, sensorId, database => {
        database.delete(apiKey, deviceId, sensorId, key, success, fail);
    }, fail);
};

exports.history = (apiKey, deviceId, sensorId, start, end, page, success, fail) => {
    getDataBase(apiKey, deviceId, sensorId, database => {
        database.history(apiKey, deviceId, sensorId, start, end, page, success, fail);
    }, fail);
};

function getDataBase(apiKey, deviceId, sensorId, success, fail) {
    sensor.checkSensor(apiKey, deviceId, sensorId, type => {
        let database = helper.dbMap[type];
        if (database) {
            success(database);
        } else {
            fail({ 'ERROR': 'DATA TYPE NOT SUPPORT' });
        }
    }, fail);
}
