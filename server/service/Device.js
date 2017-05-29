'use strict';

const utils = require('../Utils');
const deviceDao = require('../dao/DeviceDao');

const user = require('./User');
const room = require('./Room');

const infoKeys = ['title', 'about', 'room_id', 'tags', 'location'];

exports = module.exports = {
    register: async (apiKey, info) => {
        // require title
        if (info.title === undefined) throw 'ERROR: NOT ACCEPTABLE';
        if (info.title === null) throw 'ERROR: CREATE DEVICE ERROR';

        // ensure room
        checkRoom(apiKey, info);

        const defaultLocation = {
            local: null,
            latitude: 0,
            longitude: 0
        }

        let tag = utils.toTag(info.tags);
        let location = info.location ? info.location : defaultLocation;

        return deviceDao.register({
            api_key: apiKey,
            title: info.title,
            about: info.about,
            tags: tag,
            room_id: info.room_id,
            local: location.local,
            latitude: location.latitude,
            longtitude: location.longitude
        });
    },

    get: async (apiKey, deviceId) => {
        let row = await deviceDao.get(apiKey, deviceId);
        return formatRow(row);
    },

    all: async (apiKey, roomId = undefined) => {
        let rows = await deviceDao.all(apiKey, roomId);
        return rows.map(formatRow);
    },

    update: async (apiKey, deviceId, info) => {
        if (info.title === null) throw { 'error': 'TITLE CANNOT BE NULL' };

        checkRoom(apiKey, info);

        let updateData = {};
        for (let key of Object.keys(info)) {
            if (infoKeys.includes(key)) {
                if (key === 'tags') {
                    updateData.tags = utils.toTag(info.tags);
                } else if (key === 'location') {
                    updateData.local = info.location.local;
                    updateData.latitude = info.location.latitude;
                    updateData.longtitude = info.location.longitude;
                } else {
                    updateData[key] = info[key];
                }
            }
        }

        await deviceDao.update(apiKey, deviceId, updateData);
    },

    delete: async (apiKey, deviceId) => {
        await deviceDao.delete(apiKey, deviceId);
    },

    contains: async (apiKey, deviceId) => {
        return deviceDao.contains(apiKey, deviceId);
    },

    checkDevice: async function (apiKey, deviceId) {
        user.checkApiKey(apiKey);
        let res = await this.contains(apiKey, deviceId);
        if (res === undefined) throw { 'error': 'NO PERMISSION' };
    }
};

function formatRow(row) {
    return {
        id: row.id,
        title: row.title,
        about: row.about,
        tags: row.tags,
        room_id: row.room_id,
        local: row.local,
        latitude: row.latitude.toString(),
        longitude: row.longtitude.toString()
    };
}

async function checkRoom(apiKey, info) {
    if (info.room_id !== undefined) {
        await room.checkRoom(apiKey, info.room_id);
    }
}
