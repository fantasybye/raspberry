exports.start = () => {
    'use strict';

    const express = require('express');
    const bodyParser = require('body-parser');

    const db = require('./data/Database');
    const user = db.user;
    const room = db.room;
    const device = db.device;
    const sensor = db.sensor;
    const datapoint = db.datapoint;
    const switcher = require('./data/datapoints/SwitcherType');

    const app = express();

    // initialize
    app.use(bodyParser.json());
    // app.use(bodyParser.urlencoded({ extended: true }));

    app.listen(3000, function () {
        console.log('server started');
    });

    function fail(err, res) {
        console.log(err);
        res.send(JSON.stringify(err));
    }

    app.post('/register', (req, res) => {
        let username = req.body.username;
        let password = req.body.password;
        user.register(username, password,
            apiKey => res.send(JSON.stringify({ api_key: apiKey })),
            err => fail(err, res)
        );
    });

    app.post('/apikey', (req, res) => {
        let username = req.body.username;
        let password = req.body.password;
        user.getApiKey(username, password,
            apiKey => res.send(JSON.stringify({ api_key: apiKey })),
            err => fail(err, res)
        );
    });

    // rooms
    // register
    app.post('/rooms', (req, res) => {
        let apiKey = getApiKey(req);
        let info = req.body;
        room.register(
            apiKey, info,
            result => res.send(JSON.stringify({ room_id: result })),
            err => fail(err, res)
        );
    });

    // all
    app.get('/rooms', (req, res) => {
        let apiKey = getApiKey(req);
        room.all(
            apiKey,
            infos => res.send(JSON.stringify(infos)),
            err => fail(err, res)
        );
    });

    // get info
    app.get('/room/:roomId', (req, res) => {
        let apiKey = getApiKey(req);
        let roomId = req.params.roomId;
        room.get(
            apiKey, roomId,
            info => res.send(JSON.stringify(info)),
            err => fail(err, res)
        );
    });

    // update
    app.put('/room/:roomId', (req, res) => {
        let apiKey = getApiKey(req);
        let roomId = req.params.roomId;
        let info = req.body;
        room.update(
            apiKey, roomId, info,
            () => res.send(''),
            err => fail(err, res)
        );
    });

    // delete
    app.delete('/room/:roomId', (req, res) => {
        let apiKey = getApiKey(req);
        let roomId = req.params.roomId;
        room.delete(
            apiKey, roomId,
            () => res.send(''),
            err => fail(err, res)
        );
    });

    // add device to room
    app.post('/room/:roomId/devices', (req, res) => {
        let apiKey = getApiKey(req);
        let roomId = req.params.roomId;
        let info = req.body;
        console.log(roomId);
        device.setRoom(
            apiKey, roomId, info.device_id,
            devices => res.send(JSON.stringify(devices)),
            err => fail(err, res)
        );
    });

    // all devices in room
    app.get('/room/:roomId/devices', (req, res) => {
        let apiKey = getApiKey(req);
        let roomId = req.params.roomId;
        device.allInRoom(
            apiKey, roomId,
            devices => res.send(JSON.stringify(devices)),
            err => fail(err, res)
        );
    });

    //devices
    // register
    app.post('/devices', (req, res) => {
        let apiKey = getApiKey(req);
        let info = req.body;
        device.register(apiKey, info,
            result => res.send(JSON.stringify({ device_id: result })),
            err => fail(err, res)
        );
    });

    // get all info
    app.get('/devices', (req, res) => {
        let apiKey = getApiKey(req);
        device.all(apiKey,
            infos => res.send(JSON.stringify(infos)),
            err => fail(err, res)
        );
    });

    // get info
    app.get('/device/:deviceId', (req, res) => {
        let apiKey = getApiKey(req);
        let id = req.params.deviceId;
        device.get(apiKey, id,
            info => res.send(JSON.stringify(info)),
            err => fail(err, res)
        );
    });

    // update info
    app.put('/device/:deviceId', (req, res) => {
        let apiKey = getApiKey(req);
        let id = req.params.deviceId;
        let info = req.body;
        device.update(apiKey, id, info,
            () => res.send(''),
            err => fail(err, res)
        );
    });

    // delete
    app.delete('/device/:deviceId', (req, res) => {
        let apiKey = getApiKey(req);
        let id = req.params.deviceId;
        device.delete(apiKey, id,
            () => res.send(''),
            err => fail(err, res)
        );
    });

    // sensors
    // register
    app.post('/device/:deviceId/sensors', (req, res) => {
        let apiKey = getApiKey(req);
        let deviceId = req.params.deviceId;
        let info = req.body;
        sensor.register(apiKey, deviceId, info,
            id => res.send(JSON.stringify({ sensor_id: id })),
            err => fail(err, res)
        );
    });

    // info
    app.get('/device/:deviceId/sensor/:sensorId', (req, res) => {
        let apiKey = getApiKey(req);
        let deviceId = req.params.deviceId;
        let sensorId = req.params.sensorId;

        if (sensorId.endsWith('.json')) {
            dataHistory(req, res);
        } else {
            sensor.get(apiKey, deviceId, sensorId,
                info => res.send(JSON.stringify(info)),
                err => fail(err, res)
            );
        }
    });

    // all info of device
    app.get('/device/:deviceId/sensors', (req, res) => {
        let apiKey = getApiKey(req);
        let deviceId = req.params.deviceId;
        let type = req.query.type;
        sensor.all(apiKey, deviceId, type, 
            infos => res.send(JSON.stringify(infos)),
            err => fail(err, res)
        );
    });

    // update
    app.put('/device/:deviceId/sensor/:sensorId', (req, res) => {
        let apiKey = getApiKey(req);
        let deviceId = req.params.deviceId;
        let sensorId = req.params.sensorId;
        let info = req.body;
        sensor.update(apiKey, deviceId, sensorId, info,
            () => res.send(''),
            err => fail(err, res)
        );
    });

    // delete
    app.delete('/device/:deviceId/sensor/:sensorId', (req, res) => {
        let apiKey = getApiKey(req);
        let deviceId = req.params.deviceId;
        let sensorId = req.params.sensorId;
        sensor.delete(apiKey, deviceId, sensorId,
            () => res.send(''),
            err => fail(err, res)
        );
    });

    // all
    app.get('/sensors', (req, res) => {
        let apiKey = getApiKey(req);
        let type = req.query.type;
        sensor.allWithoutDeviceId(
            apiKey,
            type,
            infos => res.send(JSON.stringify(infos)),
            err => fail(err, res)
        );
    });


    // sensor data points
    // add
    app.post('/device/:deviceId/sensor/:sensorId/datapoints', (req, res) => {
        let apiKey = getApiKey(req);
        let deviceId = req.params.deviceId;
        let sensorId = req.params.sensorId;
        let data = req.body;
        datapoint.add(apiKey, deviceId, sensorId, data,
            () => res.send(''),
            err => fail(err, res)
        );
    });

    // update
    app.put('/device/:deviceId/sensor/:sensorId/datapoint/:key', (req, res) => {
        let apiKey = getApiKey(req);
        let deviceId = req.params.deviceId;
        let sensorId = req.params.sensorId;
        let key = req.params.key;
        let value = req.body;
        datapoint.update(apiKey, deviceId, sensorId, key, value,
            () => res.send(''),
            err => fail(err, res)
        );
    });

    // get latest
    app.get('/device/:deviceId/sensor/:sensorId/datapoints', (req, res) => {
        getDatapoint(req, res);
    });

    // get latest
    app.get('/device/:deviceId/sensor/:sensorId/datapoint', (req, res) => {
        getDatapoint(req, res);
    });

    // get
    app.get('/device/:deviceId/sensor/:sensorId/datapoint/:key', (req, res) => {
        getDatapoint(req, res);
    });

    function getDatapoint(req, res) {
        let apiKey = getApiKey(req);
        let deviceId = req.params.deviceId;
        let sensorId = req.params.sensorId;
        let key = req.params.key;
        datapoint.get(apiKey, deviceId, sensorId, key,
            data => res.send(JSON.stringify(data)),
            err => fail(err, res)
        );
    }

    // delete
    app.delete('/device/:deviceId/sensor/:sensorId/datapoint/:key', (req, res) => {
        let apiKey = getApiKey(req);
        let deviceId = req.params.deviceId;
        let sensorId = req.params.sensorId;
        let key = req.params.key;
        datapoint.delete(apiKey, deviceId, sensorId, key,
            () => res.send(''),
            err => fail(err, res)
        );
    });

    app.get('/commands', (req, res) => {
        let apiKey = getApiKey(req);
        switcher.allUnfetched(apiKey,
            data => res.send(JSON.stringify(data)),
            err => fail(err, res)
        );
    });

    function dataHistory(req, res) {
        let apiKey = getApiKey(req);
        let deviceId = req.params.deviceId;
        let sensorId = req.params.sensorId.replace(/.json$/, '');

        // start=<timestamp>&end=<timestamp>&interval=<interval>&page=<page>
        let start = req.query.start;
        let end = req.query.end;
        let page = req.query.page;

        // ignore interval
        datapoint.history(apiKey, deviceId, sensorId, start, end, page,
            result => res.send(JSON.stringify(result)),
            err => fail(err, res)
        );
    }

    function getApiKey(req) {
        return req.get('U-ApiKey');
    }
};
