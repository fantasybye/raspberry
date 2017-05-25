'use strict';

const db = require('./Schema');
const utils = require('./Utils');

const sensor = new Db('sensor', {
    id: {
        type: INTEGER,
        attr: [PK, AUTO_INC]
    },
    device_id: {
        type: INTEGER,
        attr: NOT_NULL
    },
    type: {
        type: INTEGER,
        defaultValue: 0
    },
    title: {
        type: VARCHAR(100),
        attr: NOT_NULL
    },
    about: VARCHAR(100),
    tags: VARCHAR(255),
    unit_name: VARCHAR(100),
    unit_symbol: REAL,
    last_update: INTEGER, // obsoleted
    last_data: REAL       // obsoleted
});

const device = require('./Device');
const user = require('./User');
const datapoint = require('./Datapoint');
const switcher = require('./datapoints/SwitcherType');

const typeMap = require('./SensorHelper').typeMap;

const supportTypes = Object.values(typeMap);
const defaultType = 0;  // value

exports.register = (apiKey, deviceId, info, success, fail) => {
    device.checkDevice(apiKey, deviceId, () => {
        if (info.title === undefined || info.title === null) {
            fail({ 'error': 'NOT ACCEPTABLE' });
            return;
        }

        let type = info.type;
        if (type === undefined || type === null) {
            type = defaultType;
        }
        if (typeof type === 'string') {
            type = typeMap[type.toLowerCase()];
        }
        if (!supportTypes.includes(type)) {
            fail({ 'error': 'SENSOR TYPE INVALID' });
            return;
        }

        let data = {
            device_id: deviceId,
            type: type,
            title: info.title,
            about: info.about,
            tags: utils.toTag(info.tags)
        };

        if (type === 0) {
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

exports.allWithoutDeviceId = (apiKey, type, success, fail) => {
    if (!Number.isInteger(type)) {
        type = typeMap[type];
        if (type === undefined) {
            fail({ 'ERROR': 'UNKNOWN SENSOR TYPE' });
            return;
        }
    }

    let sql = `SELECT
s.id          AS id,
d.id          AS device_id,
s.title       AS title,
s.about       AS about,
s.type        AS type,
s.unit_name   AS unit_name,
s.unit_symbol AS unit_symbol
FROM device d
JOIN sensor s ON d.id=s.device_id
WHERE d.api_key=?`;
    let filters = [apikey];

    if (type !== undefined) {
        sql += ` AND type=?`;
        filters.push(type);
    }

    user.checkApiKey(apiKey, () => {
        db.all(sql,
            filters,
            (err, rows) => {
                if (err) {
                    fail(err);
                } else {
                    getLastestInfos(rows, success, fail);
                }
            }
        );
    }, fail);
};

exports.all = (apiKey, deviceId, type, success, fail) => {
    let filter = { device_id: deviceId };

    if (type !== undefined) {
		if (!Number.isInteger(type)) {
		    type = typeMap[type];
		    if (type === undefined) {
		        fail({ 'ERROR': 'UNKNOWN SENSOR TYPE' });
		        return;
		    }
		}
        filter.type = type;
    }

    device.checkDevice(apiKey, deviceId, () => {
        sensor.all('*', filter, rows => {
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
                } else if (key === 'unit') {
                    if (info.unit !== null) {
                        updateData.unit_name = info.unit.name;
                        updateData.unit_symbol = info.unit.symbol;
                    } else {
                        updateData.unit_name = null;
                        updateData.unit_symbol = null;
                    }
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
        success(row.type);
    }, fail);
};

function getLastestInfos(rows, success, fail) {
    function getInfo(rows, i, infos) {
        if (i >= rows.length) {
            success(infos);
        } else {
            let row = rows[i];
            getLastestData(
                row.id,
                row.type,
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
                    } else if (row.type === 5) {
                        info.last_state = data.last_state;
                    }

                    infos.push(info);
                    getInfo(rows, i + 1, infos);
                },
                err => {
                    console.log(err);
                }
            );
        }
    }

    getInfo(rows, 0, []);
}

function getLastestData(sensorId, type, success, fail) {
    let result = { last_update: '0', last_data: '0', last_data_gen: null, last_state: 0 };
    switch (type) {
        case 0: //value
            db.get(
                'SELECT timestamp, value FROM value_data WHERE sensor_id=? ORDER BY timestamp DESC LIMIT 1',
                sensorId,
                (err, row) => {
                    if (err) {
                        fail(err);
                    } else {
                        if (row) {
                            result.last_update = row.timestamp.toString();
                            result.last_data = row.value.toString();
                        }
                        success(result);
                    }
                }
            );
            break;

        case 5: // switcher
            db.get(
                'SELECT state FROM switcher_data WHERE sensor_id=? ORDER BY timestamp DESC LIMIT 1',
                sensorId,
                (err, row) => {
                    if (err) {
                        fail(err);
                    } else {
                        if (row) {
                            result.last_state = row.state;
                        }
                        success(result);
                    }
                }
            );
            break;

        case 8: // generic
            db.get(
                'SELECT value FROM generic_data WHERE sensor_id=? ORDER BY ID DESC LIMIT 1',
                sensorId,
                (err, row) => {
                    if (err) {
                        fail(err);
                    } else {
                        if (row) {
                            result.last_data_gen = JSON.stringify(row.value);
                        }
                        success(result);
                    }
                }
            );
            break;
    }
}
