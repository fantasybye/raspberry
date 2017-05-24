'use strict';

const db = require('./Schema');
const utils = require('./Utils');

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

const user = require('./User');
const device = require('./Device');

exports.register = (apiKey, info, success, fail) => {
    user.checkApiKey(apiKey, () => {
        if (!info) {
            fail({ 'ERROR': 'NO ROOM INFO' });
        } else if (!info.title) {
            fail({ 'ERROR': 'NO TITLE' });
        } else {
            room.insert(
                {
                    api_key: apiKey,
                    title: info.title,
                    about: info.about,
                    tags: utils.toTag(info.tags)
                },
                function (err) {
                    if (err) {
                        fail(err);
                    } else {
                        success(this.lastID);
                    }
                }
            );
        }
    }, fail);
};

exports.get = (apiKey, roomId, success, fail) => {
    user.checkApiKey(apiKey, () => {
        room.get('*', { api_key: apiKey, id: roomId }, row => {
            if (!row) {
                fail({ 'ERROR': 'NO PERMISSION' });
            } else {
                success(formatInfo(row));
            }
        }, fail);
    }, fail);
};

exports.all = (apiKey, success, fail) => {
    user.checkApiKey(apiKey, () => {
        room.all('*', { api_key: apiKey }, rows => {
            let rooms = [];
            for (let row of rows) {
                rooms.push(formatInfo(row));
            }
            success(rooms);
        }, fail);
    }, fail);
};

const infoKeys = ['title', 'about', 'tags'];

exports.update = (apiKey, roomId, info, success, fail) => {
    user.checkApiKey(apiKey, () => {
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
        if (updateData.title === null) {
            fail({ 'error': 'UPDATE ERROR' });
        } else {
            room.update(updateData, { id: roomId, api_key: apiKey }, success, fail);
        }
    }, fail);
};

exports.delete = (apiKey, roomId, success, fail) => {
    user.checkApiKey(apiKey, () => {
        room.delete({ id: roomId, api_key: apiKey }, () => {
            device.removeAllFromRoom(apikey, roomId, success, fail);
        }, fail);
    }, fail);
};

exports.checkRoom = (apiKey, roomId, success, fail) => {
    user.checkApiKey(apiKey, () => {
        console.log(roomId);
        room.contains({ api_key: apiKey, id: roomId }, result => {
            if (result) {
                success();
            } else {
                fail({ 'ERROR': 'NO PERMISSION' });
            }
        });
    }, fail);
};

function formatInfo(row) {
    return {
        id: row.id,
        title: row.title,
        about: row.about,
        tags: row.tags
    };
}