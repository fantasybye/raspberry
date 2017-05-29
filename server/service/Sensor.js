'use strict';

const utils = require('../Utils');

const sensorDao = require('../dao/SensorDao');

const user = require('./User');
const device = require('./Device');

const datapoint = require('./Datapoint');
const switcher = require('./datapoints/SwitcherData');

const typeMap = require('./SensorHelper').typeMap;

const supportTypes = Object.values(typeMap);
const valueType = typeMap['value'];  // default type
const switcherType = typeMap['switcher'];

const infoKeys = ['title', 'about', 'tags', 'unit'];

exports = module.exports = {
    register: async (apiKey, deviceId, info) => {
        if (info.title === undefined || info.title === null) throw { 'error': 'NOT ACCEPTABLE' };

        let type = info.type;
        if (type === undefined || type === null) {
            type = valueType;
        } else if (typeof type === 'string') {
            type = typeMap[type.toLowerCase()];
        }

        if (!supportTypes.includes(type)) throw { 'error': 'SENSOR TYPE INVALID' };

        let data = {
            device_id: deviceId,
            type: type,
            title: info.title,
            about: info.about,
            tags: utils.toTag(info.tags)
        };

        if (type === valueType) {
            let unit = info.unit ? info.unit : { name: null, symbol: null };
            data.unit_name = unit.name;
            data.unit_symbol = unit.symbol;
        }

        let sensorId = await sensorDao.register(data);

        if (type === switcherType && info.state !== undefined) {
            await switcher.add(deviceId, sensorId, { state: info.state });
        }

        return sensorId;
    },

    get: async (apiKey, deviceId, sensorId) => {
        let row = await sensorDao.get(deviceId, sensorId);

        let info = {
            type: row.type,
            title: row.title,
            about: row.about,
            tags: row.tags
        };

        if (row.type === valueType) {
            info.unit_name = row.unit_name;
            info.unit_symbol = row.unit_symbol;
        }

        return info;
    },

    allWithoutDeviceId: async (apiKey, type = undefined) => {
        type = handleType(type);
        let rows = await sensorDao.allWithoutDeviceId(apiKey, type);
        return getLastestInfos(rows);
    },

    all: async (apiKey, deviceId, type = undefined) => {
        type = handleType(type);
        let row = await sensorDao.all(deviceId, type);
        return getLastestInfos(row);
    },

    update: async (apiKey, deviceId, sensorId, info) => {
        if (info.title === null) throw { 'warning': 'UNDEFINED ACTION' };

        let updateData = {};
        for (let key of Object.keys(info)) {
            if (infoKeys.includes(key)) {
                if (key === 'tags') {
                    updateData.tags = utils.toTag(info.tags);
                } else if (key === 'unit') {
                    if (info.unit !== null) {
                        updateData.unit_name = info.unit.name;
                        updateData.unit_symbol = info.unit.symbol;
                    } else {
                        updateData.unit_name = null;
                        updateData.unit_symbol = null;
                    }
                } else {
                    updateData[key] = info[key];
                }
            }
        }
        await sensorDao.update(deviceId, sensorId, updateData);
    },

    delete: async (apiKey, deviceId, sensorId) => {
        await sensorDao.delete(deviceId, sensorId);
    },

    contains: async (apiKey, deviceId, sensorId) => {
        return sensorDao.contains(deviceId, sensorId);
    },

    checkSensor: async (apiKey, deviceId, sensorId) => {
        await device.checkDevice(apiKey, deviceId);
        let row = await sensorDao.get(deviceId, sensorId);
        if (row === undefined) throw { 'error': 'NO PERMISSION' };
    }
};

function handleType(type) {
    if (type !== undefined) {
        let t = parseInt(type);
        if (!Number.isInteger(t)) {
            type = typeMap[type];
        } else {
            type = t;
        }
        if (type === undefined || !supportTypes.includes(type)) {
            throw { 'ERROR': 'UNKNOWN SENSOR TYPE' };
        }
        return type;
    }
}

async function getLastestInfos(rows) {
    let infos = [];
    for (let row of rows) {
        let data = await datapoint.getLatestData(row.id, row.type);
        let info = {
            id: row.id,
            device_id: row.device_id,
            title: row.title,
            about: row.about,
            type: row.type.toString(),
            last_update: data.last_update,
            last_data: data.last_data,
            last_data_gen: data.last_data_gen
        };

        if (row.type === valueType) {
            info.unit_name = row.unit_name;
            info.unit_symbol = row.unit_symbol;
        } else if (row.type === switcherType) {
            info.last_state = data.last_state;
        }

        infos.push(info);
    }

    return infos;
}
