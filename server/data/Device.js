'use strict';

const db = require('./Schema');
const utils = require('./Utils');

const DbHelper = require('./DbHelper');
const device = new DbHelper('device');

const user = require('./User');

exports.initialize = () => {
    // device info
    db.run(
        'CREATE TABLE IF NOT EXISTS `device`(' +
        '`id` INTEGER PRIMARY KEY AUTOINCREMENT,' +
        '`api_key` CHAR(32) NOT NULL,' +
        '`title` VARCHAR(100) NOT NULL,' +
        '`about` VARCHAR(100),' +
        '`tags` VARCHAR(255),' +
        '`local` VARCHAR(100),' +
        '`latitude` REAL NOT NULL DEFAULT 0,' +
        '`longtitude` REAL NOT NULL DEFAULT 0' +
        ')'
    );
};

const infoKeys = ['title', 'about', 'tags', 'location'];

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

exports.update = (apiKey, deviceId, info, success, fail) => {
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
            device.update(updateData, { id: deviceId, api_key: apiKey }, success, fail);
        }
    }, fail);
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

