'use strict';

const uuid = require('uuid/v4');

const db = require('./Schema');

const user = new Db('user', {
    api_key: {
        type: CHAR(32),
        attr: PK
    },
    username: {
        type: VARCHAR(100),
        attr: [NOT_NULL, UNIQUE]
    },
    password: {
        type: VARCHAR(100),
        attr: NOT_NULL
    }
});

exports = module.exports = {
    register: async (username, password) => {
        try {
            let apiKey = createApiKey();
            await user.insert([apiKey, username, password]);
            return apiKey;
        } catch (err) {
            console.error(err);
            console.log(username,password)
            throw 'register failed';
        }

    },

    getApiKey: async (username, password) => {
        let row = await user.get('api_key', { username: username, password: password });
        if (!row) throw "password doesn't match";
        return row.api_key;
    },

    contains: async (apiKey) => {
        return user.contains({ api_key: apiKey });
    }
};

function createApiKey() {
    return uuid().replace(/-/g, '');
}
