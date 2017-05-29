'use strict';

const utils = require('../../Utils');

const switcherData = require('../../dao/datapoints/SwitcherData')

exports = module.exports = {
    name: 'switcher',
    id: 5,

    add: async (deviceId, sensorId, info) => {
        if (!info || info.state === undefined || info.state === null) {
            if (info.value !== undefined) {
                throw { 'ERROR': 'switcher use state instead of value' };
            } else {
                throw { 'ERROR': 'state is required' };
            }
        } else if (!Number.isInteger(info.state)) {
            throw { 'ERROR': 'state should be integer' };
        }

        let state = info.state;
        let time = utils.toTime();
        await switcherData.add(deviceId, sensorId, time, state);
    },

    get: async (deviceId, sensorId, _) => {
        let row = await switcherData.get(sensorId);
        if (row === undefined) {
            return {
                timestamp: utils.toISOTime(0),
                state: 0,
                sensor_id: sensorId,
                device_id: deviceId
            };
        } else {
            return {
                timestamp: utils.toISOTime(row.timestamp),
                state: row.state,
                sensor_id: sensorId,
                device_id: deviceId
            };
        }
    },

    allUnfetched: async (apiKey) => {
        let rows = await switcherData.allUnfetched(apiKey);

        return rows.map(row => ({
            device_id: row.device_id,
            sensor_id: row.sensor_id,
            timestamp: utils.toISOTime(row.timestamp),
            state: row.state
        }));
    },

    update: async (deviceId, sensorId, _, info) => {
        if (!info || info.state === undefined) {
            if (info.value !== undefined || info.value !== null) {
                throw { 'ERROR': 'switcher use state instead of value' };
            } else {
                throw { 'ERROR': 'state is required' };
            }
        } else if (Number.isInteger(info.state)) {
            throw { 'ERROR': 'state should be integer' };
        }
        let time = utils.toTime();
        await switcherData.add(deviceId, sensorId, time, info.state, 1);
    },

    delete: async (deviceId, sensorId, timestamp) => {
        throw { 'ERROR': 'NOT SUPPORT' };
    },

    history: async (deviceId, sensorId, start, end, page) => {
        page = page !== undefined ? page : 1;

        let startTime = new Date(start).getTime() / 1000;
        let endTime = new Date(end).getTime() / 1000;

        let rows = await switcherData.history(sensorId, startTime, endTime, page);

        return rows
            .map(row => ({ timestamp: utils.toISOTime(row.timestamp), state: row.state }))
            .reverse();
    },

    getLatestData: async (sensorId) => {
        let row = await switcherData.get(sensorId);
        if (row === undefined) {
            row = { timestamp: 0, state: 0 };
        }

        return {
            last_update: row.timestamp.toString(),
            last_data: '0',
            last_data_gen: null,
            last_state: row.state
        };
    }
};
