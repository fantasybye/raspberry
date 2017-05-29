'use strict';

const db = require('./Schema');
const utils = require('../Utils');

const room = new Db('room', {
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
    tags: VARCHAR(255)
});

const deviceDao = require('./DeviceDao');

exports = module.exports = {
    register: async (info) => {
        let res = await room.insert(info);
        return res.lastID;
    },

    get: async (apiKey, roomId) => {
        let row = await room.get('*', { api_key: apiKey, id: roomId });

        if (row === undefined) throw { 'ERROR': 'NO PERMISSION' };
        return row;
    },

    contains: async (apiKey, roomId) => {
        return undefined !== await room.get('null', { api_key: apiKey, id: roomId });
    },

    all: async (apiKey) => {
        return room.all('*', { api_key: apiKey });
    },

    update: async (apiKey, roomId, info) => {
        await utils.checkResult(room.update(updateData, { id: roomId, api_key: apiKey }));
    },

    delete: async (apiKey, roomId) => {
        await utils.checkResult(room.delete({ id: roomId, api_key: apiKey }));
        await deviceDao.removeAllFromRoom(apiKey, roomId);
    },
};
