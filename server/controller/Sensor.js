'use strict';

const utils = require('../Utils');

const device = require('../service/Device');
const sensor = require('../service/Sensor');

const datapoint = require('../service/Datapoint');

exports = module.exports = utils.controller(
    async (req, apiKey, info) => {
        await device.checkDevice(apiKey, req.params.deviceId);
    },

    // register
    utils.post('/device/:deviceId/sensors', async (req, apiKey, info) => {
        let deviceId = req.params.deviceId;
        let id = await sensor.register(apiKey, deviceId, info);
        return { sensor_id: id };
    }),
    // all
    utils.get('/device/:deviceId/sensors', async (req, apiKey, info) => {
        let deviceId = req.params.deviceId;
        let type = req.query.type;
        return sensor.all(apiKey, deviceId, type);
    }),
    // get
    utils.get('/device/:deviceId/sensor/:sensorId', async (req, apiKey) => {
        let deviceId = req.params.deviceId;
        let sensorId = req.params.sensorId;

        if (sensorId.endsWith('.json')) {
            return dataHistory(req, apiKey);
        } else {
            return sensor.get(apiKey, deviceId, sensorId);
        }
    }),
    // update
    utils.put('/device/:deviceId/sensor/:sensorId', async (req, apiKey, info) => {
        let deviceId = req.params.deviceId;
        let sensorId = req.params.sensorId;
        await sensor.update(apiKey, deviceId, sensorId, info);
    }),
    // delete
    utils.delete('/device/:deviceId/sensor/:sensorId', async (req, apiKey) => {
        let deviceId = req.params.deviceId;
        let sensorId = req.params.sensorId;
        await sensor.delete(apiKey, deviceId, sensorId);
    }),
    // all
    utils.get('/sensors', async (req, apiKey) => {
        let type = req.query.type;
        return sensor.allWithoutDeviceId(apiKey, type);
    })
);

// should in Datapoint.js
// however...
async function dataHistory(req, apiKey) {
    let deviceId = req.params.deviceId;
    let sensorId = req.params.sensorId.replace(/.json$/, '');

    // start=<timestamp>&end=<timestamp>&interval=<interval>&page=<page>
    let start = req.query.start;
    let end = req.query.end;
    let page = req.query.page;

    // ignore interval
    return datapoint.history(deviceId, sensorId, start, end, page);
}
