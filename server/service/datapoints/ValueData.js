'use strict';

const utils = require('../../Utils');

const valueData = require('../../dao/datapoints/ValueData');

exports = module.exports = {
    name: 'value',
    id: 0,

    add: async (deviceId, sensorId, data) => {
        async function addOne(item) {
            let timestamp = item.timestamp;
            let value = item.value;

            if (value === undefined || value === null) throw 'value is required';
            if (typeof value !== 'number') throw 'value should be number';

            let time = utils.toTime(timestamp);
            await valueData.add(sensorId, time, value);
        }

        if (data instanceof Array) {
            let failed = {};
            for (let i = 0; i < data.length; i++) {
                try {
                    await addOne(data[i]);
                } catch (err) {
                    failed[i] = err;
                }
            }

            if (Object.keys(failed).length !== 0) {
                throw failed;
            }
        } else {
            await addOne(data);
        }
    },

    get: async (deviceId, sensorId, timestamp) => {
        if (timestamp) {
            let time = utils.toTime(timestamp);
            let row = await valueData.get(sensorId, time);

            if (row === undefined) throw { 'error': 'INVALID KEY' };
            return { value: row.value };
        } else {
            let row = await valueData.getLatest(sensorId);

            if (row) {
                return {
                    timestamp: utils.toISOTime(row.timestamp),
                    value: row.value,
                    sensor_id: sensorId,
                    device_id: deviceId
                };
            } else {
                return {
                    timestamp: utils.toISOTime(0),
                    value: 0,
                    sensor_id: sensorId,
                    device_id: deviceId
                };
            }
        }
    },

    update: async (deviceId, sensorId, timestamp, info) => {
        await valueData.update(sensorId, utils.toTime(timestamp), info.value);
    },

    delete: async (deviceId, sensorId, timestamp) => {
        await valueData.delete(sensorId, utils.toTime(timestamp));
    },

    history: async (deviceId, sensorId, start, end, page) => {
        page = page !== undefined ? page : 1;

        let startTime = new Date(start).getTime() / 1000;
        let endTime = new Date(end).getTime() / 1000;

        let rows = await valueData.history(sensorId, startTime, endTime, page);

        return rows
            .map(row => ({ timestamp: utils.toISOTime(row.timestamp), value: row.value }))
            .reverse();
    },

    getLatestData: async (sensorId) => {
        let row = await valueData.getLatest(sensorId);

        if (row === undefined) {
            row = { timestamp: 0, value: 0 };
        }

        return {
            last_update: row.timestamp.toString(),
            last_data: row.value.toString(),
            last_data_gen: null,
            last_state: 0
        };
    }
};
