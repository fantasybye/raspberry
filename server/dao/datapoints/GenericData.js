'use strict';

const db = require('../Schema');
const utils = require('../../Utils');

const genericData = new Db('generic_data', {
    id: {
        type: INTEGER,
        attr: [PK, AUTO_INC]
    },
    sensor_id: {
        type: INTEGER,
        attr: NOT_NULL
    },
    key: {
        type: VARCHAR(255),
        attr: NOT_NULL
    },
    value: TEXT
});

exports = module.exports = {
    add: async (sensorId, key, value) => {
        await genericData.insert({ sensor_id: sensorId, key: key, value: value });
    },

    get: async (sensorId, key) => {
        return genericData.get('*', { sensor_id: sensorId, key: key });
    },

    getLatest: async (senorId) => {
        return db.get('SELECT * FROM generic_data WHERE sensor_id=? ORDER BY ID DESC LIMIT 1', sensorId);
    },

    update: async (sensorId, key, info) => {
        await utils.checkResult(genericData.update(
            { value: value },
            { sensor_id: sensorId, key: key }
        ));
    },

    delete: async (sensorId, key) => {
        await utils.checkResult(genericData.delete({ sensor_id: sensorId, key: key }));
    }
};
