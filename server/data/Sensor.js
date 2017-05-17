'use strict';

const db = require('./Schema');
const utils = require('./Utils');

const DbHelper = require('./DbHelper');
const sensor = new DbHelper('sensor');

const device = require('./Device');
const user = require('./User');
const typeMap = require('./SensorHelper').typeMap;

exports.initialize = () => {
    // sensor
    db.run(
        'CREATE TABLE IF NOT EXISTS `sensor`(' +
        '`id` INTEGER PRIMARY KEY AUTOINCREMENT,' +
        '`device_id` INTEGER NOT NULL,' +
        '`type` INTEGER DEFAULT 0,' +
        '`title` VARCHAR(100) NOT NULL,' +
        '`about` VARCHAR(100),' +
        '`tags` VARCHAR(255),' +
        '`unit_name` VARCHAR(100),' +
        '`unit_symbol` REAL,' +
        '`last_update` INTEGER,' + // obsoleted
        '`last_data` REAL' +       // obsoleted
        ')'
    );
};

const supportTypes = ['value', 'switcher', 'gps', 'gen', 'photo'];
const defaultType = 'value';

exports.register = (apiKey, deviceId, info, success, fail) => {
    device.checkDevice(apiKey, deviceId, () => {
        if (info.title === undefined || info.title === null) {
            fail({ 'error': 'NOT ACCEPTABLE' });
            return;
        }

        let type = info.type ? info.type.toLowerCase() : defaultType;
        if (!supportTypes.includes(type)) {
            fail({ 'error': 'SENSOR TYPE INVALID' });
            return;
        }

        let data = {
            device_id: deviceId,
            type: typeMap[type],
            title: info.title,
            about: info.about,
            tags: utils.toTag(info.tags)
        };

        if (type === 'value') {
            let unit = info.unit ? info.unit : { name: null, symbol: null };
            data.unit_name = unit.name;
            data.unit_symbol = unit.symbol;
        }

        sensor.insert(data, function (err) {
            if (err) {
                fail(err);
            } else {
                success(this.lastID);
            }
        });
    }, fail);
};

exports.get = (apiKey, deviceId, sensorId, success, fail) => {
    device.checkDevice(apiKey, deviceId, () => {
        sensor.get('*', { id: sensorId, device_id: deviceId }, row => {
            if (!row) {
                fail({ 'error': 'NO PERMISSION' });
            } else {
                let info = {
                    type: row.type,
                    title: row.title,
                    about: row.about,
                    tags: row.tags
                };

                if (row.type === 0) {
                    info.unit_name = row.unit_name;
                    info.unit_symbol = row.unit_symbol;
                }

                success(info);
            }
        }, fail);
    }, fail);
};

exports.allWithoutDeviceId = (apiKey, success, fail) => {
    user.checkApiKey(apiKey, () => {
        sensor.all('*', {}, rows => {
            getLastestInfos(rows, success, fail);
        }, fail);
    }, fail);
};

exports.all = (apiKey, deviceId, success, fail) => {
    device.checkDevice(apiKey, deviceId, () => {
        sensor.all('*', { device_id: deviceId }, rows => {
            getLastestInfos(rows, success, fail);
        }, fail);
    }, fail);
};

const infoKeys = ['title', 'about', 'tags', 'unit'];

exports.update = (apiKey, deviceId, sensorId, info, success, fail) => {
    device.checkDevice(apiKey, deviceId, () => {
        let updateData = {};
        for (let key of Object.keys(info)) {
            if (infoKeys.includes(key)) {
                if (key === 'tags') {
                    updateData.tags = utils.toTag(info.tags);
                } else {
                    updateData[key] = info[key];
                }
            }
        }
        if (updateData.title === null) {
            fail({ 'warning': 'UNDEFINED ACTION' });
        } else {
            sensor.update(
                updateData,
                { id: sensorId, device_id: deviceId },
                success,
                fail
            );
        }
    }, fail);
};

exports.delete = (apiKey, deviceId, sensorId, success, fail) => {
    device.checkDevice(apiKey, deviceId, () => {
        sensor.delete({ id: sensorId, device_id: deviceId }, success, fail);
    }, fail);
};

exports.contains = (apiKey, deviceId, sensorId, success, fail) => {
    device.checkDevice(apiKey, deviceId, () => {
        sensor.contains({ id: sensorId, device_id: deviceId }, success, fail);
    }, fail);
};

exports.checkSensor = (apiKey, deviceId, sensorId, success, fail) => {
    exports.get(apiKey, deviceId, sensorId, row => {
        console.log(JSON.stringify(row));
        success(row.type);
    }, fail);
};

function getLastestInfos(rows, success, fail) {
    function getInfo(rows, i, infos) {
        let row = rows[i];
        getLastestData(
            row.id,
            data => {
                let info = {
                    id: row.id,
                    device_id: row.device_id,
                    title: row.title,
                    about: row.about,
                    type: row.type.toString(),
                    last_update: data.last_update,
                    last_data: data.last_data,
                    last_data_gen: data.last_data_gen
                };

                if (row.type === 0) {
                    info.unit_name = row.unit_name;
                    info.unit_symbol = row.unit_symbol;
                }

                infos.push(info);
                if (i < rows.length - 1) {
                    getInfo(rows, i + 1, infos);
                } else {
                    success(infos);
                }
            },
            err => {
                console.log(err);
            }
        );
    }

    getInfo(rows, 0, []);
}

function getLastestData(sensorId, success, fail) {
    db.get(
        'SELECT timestamp, value FROM value_data WHERE sensor_id=? ORDER BY timestamp DESC LIMIT 1',
        sensorId,
        (err, val_row) => {
            if (err) {
                fail(err);
            } else {
                db.get(
                    'SELECT value FROM generic_data WHERE sensor_id=? LIMIT 1',
                    sensorId,
                    (err, gen_row) => {
                        if (err) {
                            fail(err);
                        } else {
                            if (!val_row) {
                                val_row = {
                                    timestamp: null,
                                    value: null
                                };
                            }
                            if (!gen_row) {
                                gen_row = { value: null };
                            }
                            success({
                                last_update: val_row.timestamp ? val_row.timestamp.toString() : '0',
                                last_data: val_row.value ? val_row.value.toString() : '0',
                                last_data_gen: gen_row.value ? JSON.stringify(gen_row.value) : null
                            });
                        }
                    }
                );
            }
        }
    );
}
