'use strict';

const utils = require('../Utils');

const user = require('../service/User');
const device = require('../service/Device');

exports = module.exports = utils.controller(
    async (req, apiKey, info) => {
        await user.checkApiKey(apiKey);
    },

    // register
    utils.post('/devices', async (req, apiKey, info) => {
        let id = await device.register(apiKey, info);
        return { device_id: id };
    }),
    // all
    utils.get('/devices', async (req, apiKey) => {
        return device.all(apiKey);
    }),
    // get
    utils.get('/device/:id', async (req, apiKey) => {
        let id = req.params.id;
        return device.get(apiKey, id);
    }),
    // update
    utils.put('/device/:id', async (req, apiKey, info) => {
        let id = req.params.id;
        await device.update(apiKey, id, info);
    }),
    // delete
    utils.delete('/device/:id', async (req, apiKey) => {
        let id = req.params.id;
        await device.delete(apiKey, id);
    })
);

