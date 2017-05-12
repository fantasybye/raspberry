'use strict';

const db = require('./Schema');
const utils = require('./Utils');

const DbHelper = require('./DbHelper');
const sensor = new DbHelper('sensor');

const device = require('./Device');
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
        '`last_update` INTEGER,' +
        '`last_data` REAL' +
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

exports.all = (apiKey, deviceId, success, fail) => {
    device.checkDevice(apiKey, deviceId, () => {
        sensor.all('*', { device_id: deviceId }, rows => {
            let infos = [];
            for (let row of rows) {
                let info = {
                    id: row.id,
                    title: row.title,
                    about: row.about,
                    type: row.type.toString(),
                    last_update: row.last_update ? row.last_update.toString() : null,
                    last_data: row.last_data ? row.last_data.toString() : null,
                    last_data_gen: null // unknown
                };
                infos.push(info);
            }
            success(infos);
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
