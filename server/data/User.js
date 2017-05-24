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

exports.register = (username, password, success, fail) => {
    let apiKey = createApiKey();
    console.log(apiKey);
    user.insert([apiKey, username, password], err => {
        if (err) {
            console.log(err);
            fail('register failed');
        } else {
            success(apiKey);
        }
    });
};

exports.getApiKey = (username, password, success, fail) => {
    user.get(
        '*',
        { username: username },
        row => {
            if (!row) {
                fail("user doesn't exist");
            } else if (row.password !== password) {
                fail("password doesn't match");
            } else {
                success(row.api_key);
            }
        }
    );
};

exports.checkApiKey = (apiKey, success, fail) => {
    if (!apiKey) {
        fail('MISS API KEY');
    } else {
        user.contains({ api_key: apiKey }, result => {
            if (result) {
                success();
            } else {
                fail('U-ApiKey incorrect');
            }
        })
    }
}

function createApiKey() {
    return uuid().replace(/-/g, '');
}