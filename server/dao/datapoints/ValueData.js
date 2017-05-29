'use strict';

const db = require('../Schema');
const utils = require('../../Utils');

const valueData = new Db('value_data', {
    id: {
        type: INTEGER,
        attr: [PK, AUTO_INC]
    },
    sensor_id: {
        type: INTEGER,
        attr: NOT_NULL
    },
    timestamp: {
        type: INTEGER,
        attr: NOT_NULL
    },
    value: {
        type: REAL,
        attr: NOT_NULL
    }
});

module = module.exports = {
    add: async (sensorId, time, value) => {
        await valueData.insert({ sensor_id: sensorId, timestamp: time, value: value });
    },

    get: async (sensorId, time) => {
        return valueData.get('*', { sensor_id: sensorId, timestamp: time });
    },

    getLatest: async (sensorId) => {
        return db.get(
            'SELECT timestamp, value FROM value_data WHERE sensor_id=? ORDER BY timestamp DESC LIMIT 1',
            sensorId
        );
    },

    update: async (sensorId, time, value) => {
        await utils.checkResult(valueData.update(
            { value: value },
            { sensor_id: sensorId, timestamp: time }
        ));
    },

    delete: async (sensorId, time) => {
        await utils.checkResult(valueData.delete({ sensor_id: sensorId, timestamp: time }));
    },

    history: async (sensorId, startTime, endTime, page) => {
        const pageSize = 200;

        let offset = (page - 1) * pageSize;
        let limit = pageSize;

        return db.all(
            'SELECT timestamp, value FROM value_data WHERE sensor_id=? AND timestamp BETWEEN ? AND ? ORDER BY timestamp DESC LIMIT ?, ?',
            [sensorId, startTime, endTime, offset, limit]
        );
    }
};
