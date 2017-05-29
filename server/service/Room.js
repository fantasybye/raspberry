'use strict';

const utils = require('../Utils');

const roomDao = require('../dao/RoomDao');

const user = require('./User');
const device = require('./Device');

const infoKeys = ['title', 'about', 'tags'];

exports = module.exports = {
    register: async (apiKey, info) => {
        if (!info) throw { 'ERROR': 'NO ROOM INFO' };
        if (!info.title) throw { 'ERROR': 'NO TITLE' };

        await user.checkApiKey(apiKey);
        return roomDao.register({
            api_key: apiKey,
            title: info.title,
            about: info.about,
            tags: utils.toTag(info.tags)
        });
    },

    get: async (apiKey, roomId) => {
        await user.checkApiKey(apiKey);
        let row = await roomDao.get(apiKey, roomId);
        return formatRow(row);
    },

    all: async (apiKey) => {
        await user.checkApiKey(apiKey);
        let rows = await roomDao.all(apiKey);
        return rows.map(formatRow);
    },

    update: async (apiKey, roomId, info) => {
        if (info.title === null) throw { 'error': 'UPDATE ERROR' };

        let updateData = {};
        for (let key of Object.keys(info)) {
            if (infoKeys.includes(key)) {
                if (key === 'tags') {
                    updateData.tags = utils.toTag(info.tags);
                } else {
                    updateData[key] = info[key];
                }
            }
        }

        await user.checkApiKey(apiKey);
        await roomDao.update(apiKey, roomId, info);
    },

    delete: async (apiKey, roomId) => {
        await user.checkApiKey(apiKey);
        await roomDao.delete(apiKey, roomId);
    },

    checkRoom: async (apiKey, roomId) => {
        await user.checkApiKey(apiKey);
        let contains = await roomDao.contains(apiKey, roomId);
        if (!contains) throw { 'ERROR': 'NO PERMISSION' };
    }
};

function formatRow(row) {
    return {
        id: row.id,
        title: row.title,
        about: row.about,
        tags: row.tags
    };
}
