'use strict';

const utils = require('../Utils');

const user = require('../service/User');

exports = module.exports = utils.controller(
    () => { },

    // register
    utils.post('/register', async (req) => {
        let username = req.body.username;
        let password = req.body.password;
        let apiKey = await user.register(username, password);
        return { api_key: apiKey };
    }),
    // get api key
    utils.post('/apikey', async (req) => {
        let username = req.body.username;
        let password = req.body.password;
        let apiKey = await user.getApiKey(username, password);
        return { api_key: apiKey };
    })
);
