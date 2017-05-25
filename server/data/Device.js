'use strict';

const db = require('./Schema');
const utils = require('./Utils');

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

const user = require('./User');
const room = require('./Room');
const sensor = require('./Sensor');

db.serialize(function () {
    db.all('PRAGMA table_info(device)', (err, rows) => {
        if (!err) {
            if (!rows.some(row => row.name.toLowerCase() === 'room_id')) {
                db.run('ALTER TABLE device ADD COLUMN room_id INTEGER');
            }
        }
    });
});

const infoKeys = ['title', 'about', 'room_id', 'tags', 'location'];

exports.register = (apiKey, info, success, fail) => {
    // require title
    if (info.title === undefined) {
        fail('ERROR: NOT ACCEPTABLE');
        return;
    }
    if (info.title === null) {
        fail('ERROR: CREATE DEVICE ERROR');
        return;
    }

    const defaultLocation = {
        local: null,
        latitude: 0,
        longitude: 0
    }

    let tag = utils.toTag(info.tags);
    let location = info.location ? info.location : defaultLocation;

    user.checkApiKey(apiKey, () => {
        device.insert(
            {
                api_key: apiKey,
                title: info.title,
                about: info.about,
                tags: tag,
                room_id: info.room_id,
                local: location.local,
                latitude: location.latitude,
                longtitude: location.longitude
            },
            function (err) {
                if (err) {
                    fail(err);
                } else {
                    success(this.lastID);
                }
            }
        );
    }, fail);
};

exports.get = (apiKey, deviceId, success, fail) => {
    user.checkApiKey(apiKey, () =>
        device.get('*', { id: deviceId, api_key: apiKey }, row => {
            if (!row) {
                fail({ 'error': 'NO PERMISSION' });
            } else {
                let info = {
                    title: row.title,
                    about: row.about,
                    tags: row.tags,
                    room_id: row.room_id,
                    local: row.local,
                    latitude: row.latitude.toString(),
                    longitude: row.longtitude.toString()
                };
                success(info);
            }
        }, fail)
        , fail);
};

exports.all = (apiKey, success, fail) => {
    user.checkApiKey(apiKey, () =>
        device.all('*', { api_key: apiKey }, rows => {
            let devices = [];
            for (let row of rows) {
                let info = {
                    id: row.id,
                    title: row.title,
                    about: row.about,
                    tags: row.tags,
                    room_id: row.room_id,
                    local: row.local,
                    latitude: row.latitude.toString(),
                    longitude: row.longtitude.toString()
                };
                devices.push(info);
            }
            success(devices);
        }, fail)
        , fail);
};

exports.allInRoom = (apiKey, roomId, success, fail) => {
    user.checkApiKey(apiKey, () => {
        device.all('*', { api_key: apiKey, room_id: roomId }, rows => {
            let devices = [];
            for (let row of rows) {
                let info = {
                    id: row.id,
                    title: row.title,
                    about: row.about,
                    tags: row.tags,
                    local: row.local,
                    latitude: row.latitude.toString(),
                    longitude: row.longtitude.toString()
                };
                devices.push(info);
            }
            success(devices);
        }, fail);
    }, fail);
};

exports.setRoom = (apiKey, roomId, deviceId, success, fail) => {
    room.checkRoom(apiKey, roomId, () => {
        console.log('set');
        device.update({ room_id: roomId }, { api_key: apiKey, id: deviceId }, success, fail);
    }, fail);
};

exports.update = (apiKey, deviceId, info, success, fail) => {
    user.checkApiKey(apiKey, () => {
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
        if (updateData.title === null) {
            fail({ 'error': 'UPDATE ERROR' });
        } else {
            device.update(updateData, { id: deviceId, api_key: apiKey }, success, fail);
        }
    }, fail);
};

exports.removeAllFromRoom = (apiKey, roomId, success, fail) => {
    device.update({ room_id: null }, { api_key: apiKey, room_id: roomId }, success, fail);
};

exports.delete = (apiKey, deviceId, success, fail) => {
    user.checkApiKey(apiKey, () => {
        device.delete({ id: deviceId, api_key: apiKey }, success, fail);
    }, fail);
};

exports.contains = (apiKey, deviceId, success, fail) => {
    user.checkApiKey(apiKey, () => {
        device.contains({ id: deviceId, api_key: apiKey }, success, fail);
    }, fail);
};

exports.checkDevice = (apiKey, deviceId, success, fail) => {
    this.contains(apiKey, deviceId, result => {
        if (result) {
            success();
        } else {
            fail({ 'error': 'NO PERMISSION' });
        }
    }, fail);
};

