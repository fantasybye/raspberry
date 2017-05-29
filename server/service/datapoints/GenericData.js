'use strict';

const genericData = require('../../dao/datapoints/GenericData');

exports = module.exports = {
    name: 'gen',
    id: 8,

    add: async (deviceId, sensorId, data) => {
        let key = data.key;
        let value = JSON.stringify(data.value);
        await genericData.add(sensorId, key, value);
    },

    get: async (deviceId, sensorId, key) => {
        if (key) {
            let row = await genericData.get(sensorId, key);
            if (row === undefined) throw { 'error': 'INVALID KEY' };
            return { value: JSON.parse(row.value) };
        } else {
            let row = await genericData.getLatest(sensorId);
            if (row === undefined) throw { 'ERROR': 'NO RECORD' };
            return {
                key: row.key,
                value: JSON.parse(row.value),
                sensor_id: sensorId,
                device_id: deviceId
            };
        }
    },

    update: async (deviceId, sensorId, key, info) => {
        await genericData.update(sensorId, key, JSON.stringify(info.value));
    },

    delete: async (deviceId, sensorId, key) => {
        await genericData.delete(sensorId, key);
    },

    history: async (deviceId, sensorId, start, end, page) => {
        throw { 'ERROR': 'NOT SUPPORT' };
    },

    getLatestData: async (sensorId) => {
        let row = await genericData.getLatest(sensorId);

        return {
            last_update: '0',
            last_data: '0',
            last_data_gen: row.value ? row.value : null,
            last_state: 0
        };
    }
};
