'use strict';

const utils = require('../Utils');

const user = require('../service/User');
const room = require('../service/Room');
const device = require('../service/Device');

exports = module.exports = utils.controller(
    async (req, apiKey, info) => {
        await user.checkApiKey(apiKey);
    },

    // register
    utils.post('/rooms', async (req, apiKey, info) => {
        let id = await room.register(apiKey, info);
        return { room_id: id };
    }),
    // all
    utils.get('/rooms', async (req, apiKey) => {
        return room.all(apiKey);
    }),
    // get
    utils.get('/room/:roomId', async (req, apiKey, info) => {
        let roomId = req.params.roomId;
        return room.get(apiKey, roomId);
    }),
    // update
    utils.put('/room/:roomId', async (req, apiKey, info) => {
        let roomId = req.params.roomId;
        await room.update(apiKey, roomId, info);
    }),
    // delete
    utils.delete('/room/:roomId', async (req, apiKey) => {
        let roomId = req.params.roomId;
        await room.delete(apiKey, roomId);
    }),
    // all devices in room
    utils.get('/room/:roomId/devices', async (req, apiKey) => {
        let roomId = req.params.roomId;
        return device.all(apiKey, roomId);
    })
);