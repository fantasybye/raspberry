'use strict';

const db = require('./Schema');
const utils = require('../Utils');

const device = new Db('device', {
    id: {
        type: INTEGER,
        attr: [PK, AUTO_INC]
    },
    api_key: {
        type: CHAR(32),
        attr: NOT_NULL
    },
    title: {
        type: VARCHAR(100),
        attr: NOT_NULL
    },
    about: VARCHAR(255),
    tags: VARCHAR(255),
    local: VARCHAR(100),
    latitude: {
        type: REAL,
        attr: NOT_NULL,
        defaultValue: 0
    },
    longtitude: {
        type: REAL,
        attr: NOT_NULL,
        defaultValue: 0
    }
});

utils.sync(() => {
    db.all('PRAGMA table_info(device)', (err, rows) => {
        if (!err) {
            if (!rows.some(row => row.name.toLowerCase() === 'room_id')) {
                db.run('ALTER TABLE device ADD COLUMN room_id INTEGER');
            }
        }
    });
});

exports = module.exports = {
    register: async (info) => {
        let res = await device.insert(info);
        return res.lastID;
    },

    get: async (apiKey, deviceId) => {
        let row = await device.get('*', { id: deviceId, api_key: apiKey });

        if (!row) throw { 'ERROR': 'NO PERMISSION' };
        return row;
    },

    contains: async (apiKey, deviceId) => {
        return device.contains({ id: deviceId, api_key: apiKey });
    },

    all: async (apiKey, roomId = undefined) => {
        return device.all('*', { api_key: apiKey, room_id: roomId });
    },

    update: async (apiKey, deviceId, info) => {
        await utils.checkResult(device.update(info, { id: deviceId, api_key: apiKey }));
    },

    removeAllFromRoom: async (apiKey, roomId) => {
        await device.update({ room_id: null }, { api_key: apiKey, room_id: roomId });
    },

    delete: async (apiKey, deviceId) => {
        await utils.checkResult(device.delete({ id: deviceId, api_key: apiKey }));
    }
};

