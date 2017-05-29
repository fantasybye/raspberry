'use strict';

const userDao = require('../dao/UserDao');

exports = module.exports = {
    register: async (username, password) => {
        return userDao.register(username, password);
    },

    getApiKey: async (username, password) => {
        return userDao.getApiKey(username, password);
    },

    checkApiKey: async (apiKey) => {
        if (!apiKey) throw 'MISS API KEY';

        let res = await userDao.contains(apiKey);
        if (!res) throw 'U-ApiKey incorrect';
    }
};
