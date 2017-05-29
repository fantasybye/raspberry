'use strict';

const sensor = require('../dao/SensorDao');
const helper = require('./SensorHelper');

exports = module.exports = {
    add: async (deviceId, sensorId, data) => {
        let db = await getService(deviceId, sensorId);
        await db.add(deviceId, sensorId, data);
    },

    get: async (deviceId, sensorId, key) => {
        let db = await getService(deviceId, sensorId);
        return db.get(deviceId, sensorId, key);
    },

    update: async (deviceId, sensorId, key, value) => {
        let db = await getService(deviceId, sensorId);
        await db.update(deviceId, sensorId, key, value);
    },

    delete: async (deviceId, sensorId, key) => {
        let db = await getService(deviceId, sensorId);
        await db.delete(deviceId, sensorId, key);
    },

    history: async (deviceId, sensorId, start, end, page) => {
        let db = await getService(deviceId, sensorId);
        return db.history(deviceId, sensorId, start, end, page);
    },

    getLatestData: async (sensorId, type) => {
        let db = helper.servMap[type];
        return db.getLatestData(sensorId);
    }
};

async function getService(deviceId, sensorId) {
    let type = await sensor.getType(deviceId, sensorId);
    let db = helper.servMap[type];
    if (db === undefined) throw { 'ERROR': 'DATA TYPE NOT SUPPORT' };
    return db;
}

