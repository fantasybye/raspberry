'use strict';

const db = require('./Schema');
const utils = require('../Utils');

exports.Db = class {
    constructor(tableName, schema) {
        this.table = tableName;
        if (schema) {
            utils.sync(async () => {
                let cols = [];
                schema.forEach((col, config) => {
                    cols.push(formatColDef(col, config));
                });

                let tableDef = `CREATE TABLE IF NOT EXISTS ${tableName} (${cols.join(',')})`;
                await db.run(tableDef);
            });
        }
    }

    insert(data) {
        if (data instanceof Array) {
            let param = createParam(data.length);
            let sql = `INSERT INTO ${this.table} VALUES(${param})`;
            return db.run(sql, data);
        } else {
            let keys = Object.keys(data);
            let values = Object.values(data);
            let param = createParam(keys.length);
            let sql = `INSERT INTO ${this.table} (${keys.join(',')}) VALUES(${param})`;
            return db.run(sql, values);
        }
    }

    async contains(conditions) {
        return undefined !== await this.get('null', conditions);
    }

    async get(columns, conditions) {
        let cols = parseColumns(columns);
        let [cons, vals] = parseConditions(conditions);
        let sql = `SELECT ${cols.join(',')} FROM ${this.table} `;
        if (cons.length !== 0) {
            sql += `WHERE ${cons.join(' AND ')}`;
        }

        return db.get(sql, vals);
    }

    async all(columns, conditions) {
        let cols = parseColumns(columns);
        let [cons, vals] = parseConditions(conditions);
        let sql = `SELECT ${cols.join(',')} FROM ${this.table} `;
        if (cons.length !== 0) {
            sql += `WHERE ${cons.join(' AND ')}`;
        }

        return db.all(sql, vals);
    }

    async update(updates, conditions) {
        let [cols, newVals] = parseConditions(updates);
        let [cons, vals] = parseConditions(conditions);
        let sql = `UPDATE ${this.table} SET ${cols.join(',')} WHERE ${cons.join(' AND ')}`;
        return db.run(sql, newVals.concat(vals));
    }

    async delete(conditions) {
        let [cons, vals] = parseConditions(conditions);
        return db.run(`DELETE FROM ${this.table} WHERE ${cons.join(' AND ')}`, vals);
    }
}

function formatColDef(col, config) {
    if (typeof config === 'string') {
        return `${col} ${config}`;
    } else {
        let isPK = false;
        let attrs = '';
        if (config.attr) {
            if (config.attr instanceof Array) {
                isPK = config.attr.includes(exports.PK);
                attrs = config.attr.join(' ');
            } else if (typeof config.attr === 'string') {
                isPK = config.attr === exports.PK;
                attrs = config.attr;
            } else {
                throw new Error('invalid attr');
            }
        }

        let colDef = `${col} ${config.type} ${attrs}`;

        if (!isPK) {
            let defaultValue = '';
            if (config.defaultValue !== undefined) {
                defaultValue = ' DEFAULT ';
                if (typeof config.defaultValue === 'string') {
                    defaultValue += `'${config.defaultValue}'`;
                } else {
                    defaultValue += config.defaultValue;
                }
            }
            colDef += defaultValue;
        }
        return colDef.replace(/\s+/g, ' ').replace(/\s+$/, '');
    }
}

function createParam(length) {
    let param = new Array(length);
    param.fill('?');
    return param.join(',');
}

function parseColumns(columns) {
    function parseObjColumns(obj) {
        return Object.keys(obj).map(k => `${k} AS ${obj[k]}`);
    }

    let cols = [];
    if (columns instanceof Array) {
        for (let item of columns) {
            if (typeof item === 'string') {
                cols.push(item);
            } else {
                parseObjColumns(item);
            }
        }
    } else if (typeof columns === 'string') {
        cols.push(columns);
    } else {
        parseObjColumns(columns);
    }

    return cols;
}

function parseConditions(conditions) {
    function parseObjConditions(obj) {
        obj.forEach((k, v) => {
            if (v !== undefined) {
                cons.push(`${k}=?`);
                vals.push(v);
            }
        });
    }

    let cons = [];
    let vals = [];
    if (conditions instanceof Array) {
        for (let item of conditions) {
            if (typeof item === 'string') {
                cons.push(item);
            } else {
                parseObjConditions(item);
            }
        }
    } else if (typeof conditions === 'string') {
        cons.push(conditions);
    } else {
        parseObjConditions(conditions);
    }

    return [cons, vals];
}

Object.defineProperties(exports, {
    PK: {
        value: 'PRIMARY KEY',
        enumerable: true
    },
    AUTO_INC: {
        value: 'AUTOINCREMENT',
        enumerable: true
    },
    NOT_NULL: {
        value: 'NOT NULL',
        enumerable: true
    },
    UNIQUE: {
        value: 'UNIQUE',
        enumerable: true
    }
});

const typeList = ['INTEGER', 'REAL', 'TEXT', 'BLOB'];
const sizeableTypeList = ['CHAR', 'VARCHAR'];

let propDef = {};
for (let type of typeList) {
    propDef[type] = { value: type, enumerable: true };
}

for (let type of sizeableTypeList) {
    propDef[type] = {
        value: function (size) {
            if (!Number.isInteger(size) || size <= 0) {
                throw new Error('size should be a positive integer');
            }
            return `${type}(${size})`;
        },
        enumerable: true
    }
}

Object.defineProperties(exports, propDef);
