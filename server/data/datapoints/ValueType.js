'use strict';

const db = require('../Schema');

const DbHelper = require('../DbHelper');
const valueData = new DbHelper('value_data');

exports.name = 'value';
exports.id = 0;

exports.initialize = () => {
    db.run(
        'CREATE TABLE IF NOT EXISTS `value_data`(' +
        '`id` INTEGER PRIMARY KEY AUTOINCREMENT,' +
        '`sensor_id` INTEGER NOT NULL,' +
        '`timestamp` INTEGER NOT NULL,' +
        '`value` REAL NOT NULL' +
        ')'
    );
};

exports.add = (apiKey, deviceId, sensorId, data, success, fail) => {
    if (data instanceof Array) {
        let failed = {};
        for (let i = 0; i < data.length; i++) {
            let d = data[i];
            if (!d.value) {
                failed[i] = "value is required";
                continue;
            }

            let time = toTime(d.timestamp);
            valueData.insert({ sensor_id: sensorId, timestamp: time, value: d.value },
                err => {
                    if (err) {
                        failed[i] = err;
                    }
                }
            );
        }

        if (Object.keys(failed).length === 0) {
            success();
        } else {
            fail(failed);
        }
    } else {
        if (!data.value) {
            fail("value is required");
            return;
        }

        let time = toTime(data.timestamp);
        valueData.insert({ sensor_id: sensorId, timestamp: time, value: data.value },
            err => {
                if (err) {
                    fail(err);
                } else {
                    success();
                }
            }
        );
    }
};

exports.get = (apiKey, deviceId, sensorId, timestamp, success, fail) => {
    if (timestamp) {
        valueData.get(
            'value',
            {
                sensor_id: sensorId,
                timestamp: toTime(timestamp)
            },
            row => {
                if (row) {
                    success({ value: row.value });
                } else {
                    fail({ 'error': 'INVALID KEY' });
                }
            },
            fail
        );
    } else {
        db.get(
            'SELECT timestamp, value FROM value_data WHERE sensor_id=? ORDER BY timestamp DESC LIMIT 1',
            sensorId,
            (err, row) => {
                if (err) {
                    fail(err);
                } else {
                    if (!row) {
                        success({
                            value: 0,
                            timestamp: toISOTime(0),
                            sensor_id: sensorId,
                            device_id: deviceId
                        });
                    } else {
                        var isoTime = toISOTime(row.timestamp);
                        success({
                            timestamp: isoTime,
                            value: row.value,
                            sensor_id: sensorId,
                            device_id: deviceId
                        });
                    }
                }
            }
        );
    }
};

exports.update = (apiKey, deviceId, sensorId, timestamp, value, success, fail) => {
    valueData.update(
        { value: value },
        { sensor_id: sensorId, timestamp: toTime(timestamp) },
        success,
        fail
    );
};

exports.delete = (apiKey, deviceId, sensorId, timestamp, success, fail) => {
    valueData.delete(
        { sensor_id: sensorId, timestamp: toTime(timestamp) },
        success,
        fail
    );
};

exports.history = (apiKey, deviceId, sensorId, start, end, page, success, fail) => {
    const pageSize = 200;

    page = page !== undefined ? page : 1;

    let startTime = new Date(start).getTime() / 1000;
    let endTime = new Date(end).getTime() / 1000;
    let offset = (page - 1) * pageSize;
    let limit = pageSize;
    db.all(
        'SELECT timestamp, value FROM value_data WHERE sensor_id=? AND timestamp BETWEEN ? AND ? ORDER BY timestamp DESC LIMIT ?, ?',
        [sensorId, startTime, endTime, offset, limit],
        (err, rows) => {
            if (err) {
                fail(err);
            } else {
                let result = [];
                for (let row of rows) {
                    result.push({ timestamp: toISOTime(row.timestamp), value: row.value });
                }
                success(result.reverse());
            }
        }
    );
};


const timeZoneOffset = new Date().getTimezoneOffset() * 60000;

function toTime(isoTime) {
    let time = isoTime
        ? (new Date(isoTime).getTime() + timeZoneOffset)
        : new Date().getTime();
    return Math.floor(time / 1000);
}

function toISOTime(time) {
    return new Date(time * 1000 - timeZoneOffset)
        .toISOString()
        .replace(/\..*$/, '');
}
