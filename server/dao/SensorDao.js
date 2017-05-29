'use strict';

const db = require('./Schema');
const utils = require('../Utils');

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

exports = module.exports = {
    register: async (info) => {
        let res = await sensor.insert(info);
        return res.lastID;
    },

    get: async (deviceId, sensorId) => {
        let row = await sensor.get('*', { id: sensorId, device_id: deviceId });
        if (row === undefined) throw { 'error': 'NO PERMISSION' };
        return row;
    },

    allWithoutDeviceId: async (apiKey, type) => {
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
        let filters = [apiKey];

        if (type !== undefined) {
            sql += ' AND type=?';
            filters.push(type);
        }

        return db.all(sql, filters);
    },

    all: async (deviceId, type) => {
        return sensor.all('*', { device_id: deviceId, type: type });
    },

    update: async (deviceId, sensorId, info) => {
        await utils.checkResult(sensor.update(info, { id: sensorId, device_id: deviceId }));
    },

    delete: async (deviceId, sensorId) => {
        await utils.checkResult(sensor.delete({ id: sensorId, device_id: deviceId }));
    },

    contains: async (deviceId, sensorId) => {
        return sensor.contains({ id: sensorId, device_id: deviceId });
    },

    getType: async (deviceId, sensorId) => {
        let row = await sensor.get('type', { id: sensorId, device_id: deviceId });
        if (row === undefined) throw { 'error': 'NO PERMISSION' };
        return row.type;
    }
};
