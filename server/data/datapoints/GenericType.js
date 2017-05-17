'use strict';

const db = require('../Schema');

const DbHelper = require('../DbHelper');
const genericData = new DbHelper('generic_data');

exports.name = 'gen';
exports.id = 8;

exports.initialize = () => {
    db.run(
        'CREATE TABLE IF NOT EXISTS `generic_data`(' +
        '`id` INTEGER PRIMARY KEY AUTOINCREMENT,' +
        '`sensor_id` INTEGER NOT NULL,' +
        '`key` VARCHAR(128) NOT NULL,' +
        '`value` TEXT' +
        ')'
    );
};

exports.add = (apiKey, deviceId, sensorId, data, success, fail) => {
    let key = data.key;
    let value = JSON.stringify(data.value);
    genericData.insert({ sensor_id: sensorId, key: key, value: value },
        err => {
            if (err) {
                fail(err);
            } else {
                success();
            }
        }
    );
};

exports.get = (apiKey, deviceId, sensorId, key, success, fail) => {
    if (key) {
        genericData.get('value', { sensor_id: sensorId, key: key }, row => {
            if (row) {
                success({ value: JSON.parse(row.value) });
            } else {
                fail({ 'error': 'INVALID KEY' });
            }
        }, fail);
    } else {
        db.get(
            'SELECT key, value FROM generic_data WHERE sensor_id=? LIMIT 1',
            sensorId,
            (err, row) => {
                if (err) {
                    fail(err);
                } else {
                    if (!row) {
                        fail({ 'ERROR': 'NO RECORD' });
                    } else {
                        success({
                            key: row.key,
                            value: JSON.parse(row.value),
                            sensor_id: sensorId,
                            device_id: deviceId
                        });
                    }
                }
            }
        )
        genericData.all(['key', 'value'], { sensor_id: sensorId }, rows => {

        });
    }
};

exports.update = (apiKey, deviceId, sensorId, key, value, success, fail) => {
    genericData.update(
        { value: JSON.stringify(value) },
        { sensor_id: sensorId, key: key },
        success,
        fail
    );
};

exports.delete = (apiKey, deviceId, sensorId, key, success, fail) => {
    genericData.delete(
        { sensor_id: sensorId, key: key },
        success,
        fail
    );
};

exports.history = (apiKey, deviceId, sensorId, start, end, page, success, fail) => {
    fail({ 'ERROR': 'NOT SUPPORT' });
};
