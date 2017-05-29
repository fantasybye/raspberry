'use strict';

const utils = require('../Utils');

const sensor = require('../service/Sensor');
const datapoint = require('../service/Datapoint');
const switcher = require('../service/datapoints/SwitcherData');

exports = module.exports = utils.controller(
    (req, apiKey) => {
        sensor.checkSensor(apiKey, req.params.deviceId, req.params.sensorId);
    },

    // add
    utils.post('/device/:deviceId/sensor/:sensorId/datapoints', async (req, _, info) => {
        let deviceId = req.params.deviceId;
        let sensorId = req.params.sensorId;
        await datapoint.add(deviceId, sensorId, info);
    }),
    // update
    utils.put('/device/:deviceId/sensor/:sensorId/datapoint/:key', async (req, _, info) => {
        let deviceId = req.params.deviceId;
        let sensorId = req.params.sensorId;
        let key = req.params.key;
        await datapoint.update(deviceId, sensorId, key, info);
    }),
    // get latest
    utils.get('/device/:deviceId/sensor/:sensorId/datapoints', async (req) => {
        return getDatapoint(req);
    }),
    // get latest
    utils.get('/device/:deviceId/sensor/:sensorId/datapoint', async (req) => {
        return getDatapoint(req);
    }),

    // get latest
    utils.get('/device/:deviceId/sensor/:sensorId/datapoint/:key', async (req) => {
        return getDatapoint(req);
    }),

    // delete
    utils.delete('/device/:deviceId/sensor/:sensorId/datapoint/:key', async (req) => {
        let deviceId = req.params.deviceId;
        let sensorId = req.params.sensorId;
        let key = req.params.key;
        await datapoint.delete(deviceId, sensorId, key);
    }),
    // all commands
    utils.get('/commands', async (req, apiKey) => {
        return switcher.allUnfetched(apiKey);
    })
);

async function getDatapoint(req) {
    let deviceId = req.params.deviceId;
    let sensorId = req.params.sensorId;
    let key = req.params.key;
    return datapoint.get(deviceId, sensorId, key);
}
