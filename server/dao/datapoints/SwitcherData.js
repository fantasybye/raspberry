'use strict';

const db = require('../Schema');
const utils = require('../../Utils');

const switcherData = new Db('switcher_data', {
    id: {
        type: INTEGER,
        attr: [PK, AUTO_INC]
    },
    device_id: {
        type: INTEGER,
        attr: NOT_NULL
    },
    sensor_id: {
        type: INTEGER,
        attr: NOT_NULL
    },
    timestamp: {
        type: INTEGER,
        attr: NOT_NULL
    },
    state: {
        type: INTEGER,
        attr: NOT_NULL
    },
    fetched: {
        type: INTEGER,
        attr: NOT_NULL,
        defaultValue: 0
    }
});

exports = module.exports = {
    add: async (deviceId, sensorId, time, state, fetched = 0) => {
        await switcherData.insert({ device_id: deviceId, sensor_id: sensorId, timestamp: time, state: state, fetched: fetched });
    },

    get: async (sensorId) => {
        return db.get(
            'SELECT * FROM switcher_data WHERE sensor_id=? ORDER BY timestamp DESC LIMIT 1',
            [sensorId]
        );
    },

    allUnfetched: async (apiKey) => {
        let rows = await db.all(
            `SELECT
s.device_id AS device_id,
s.sensor_id AS sensor_id,
s.timestamp AS timestamp,
s.state AS state
FROM device d
JOIN switcher_data s ON d.id=s.device_id
WHERE d.api_key=?
  AND fetched=0
GROUP BY sensor_id
ORDER BY s.timestamp DESC`,
            apiKey);

        await db.run(`UPDATE switcher_data SET fetched=1
WHERE exists (SELECT null FROM device d WHERE d.api_key=? AND d.id=switcher_data.device_id)
  AND fetched=0`,
            apiKey);

        return rows;
    },

    history: async (sensorId, startTime, endTime, page) => {
        const pageSize = 200;

        let offset = (page - 1) * pageSize;
        let limit = pageSize;

        return db.all(
            'SELECT timestamp, state FROM switcher_data WHERE sensor_id=? AND timestamp BETWEEN ? AND ? ORDER BY timestamp DESC LIMIT ?, ?',
            [sensorId, startTime, endTime, offset, limit]
        );
    }
};
