'use strict';

const db = require('sqlite');
const utils = require('../Utils')

// make asynchronous synchronous (?)
exports = module.exports = utils.sync(db.open('data.db', { cached: true }));
