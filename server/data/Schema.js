'use strict';

const sqlite3 = require('sqlite3').verbose();
exports = module.exports = new sqlite3.Database('data.db');
