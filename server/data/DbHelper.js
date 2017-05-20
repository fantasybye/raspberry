'use strict';

const db = require('./Schema');
require('./Utils');

exports.Db = class DbHelper {
    constructor(tableName, schema) {
        this.table = tableName;
        if (schema) {
            db.serialize(function () {
                let cols = [];
                schema.forEach((col, config) => {
                    if (typeof config === 'string') {
                        cols.push(`${col} ${config}`);
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
                                throw 'invalid attr';
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
                        colDef = colDef.replace(/\s+/g, ' ').replace(/\s+$/, '');
                        cols.push(colDef);
                    }
                });

                let tableDef = `CREATE TABLE IF NOT EXISTS ${tableName} (${cols.join(',')})`;
                db.run(tableDef);
            });
        }
    }

    insert(data, callback) {
        if (data instanceof Array) {
            let param = createParam(data.length);
            let sql = `INSERT INTO ${this.table} VALUES(${param})`;
            db.run(sql, data, callback);
        } else {
            let keys = Object.keys(data);
            let values = Object.values(data);
            let param = createParam(keys.length);
            let sql = `INSERT INTO ${this.table} (${keys.join(',')}) VALUES(${param})`;
            db.run(sql, values, callback);
        }
    }

    contains(conditions, callback) {
        this.get('null', conditions, row => callback(!!row));
    }

    get(columns, conditions, success, fail) {
        exec(columns, conditions, (cols, cons, vals) => {
            let sql = `SELECT ${cols.join(',')} FROM ${this.table} `;
            if (cons.length !== 0) {
                sql += `WHERE ${cons.join(' AND ')}`;
            }
            db.get(
                `SELECT ${cols.join(',')} FROM ${this.table} WHERE ${cons.join(' AND ')}`,
                vals,
                (err, row) => {
                    if (err) {
                        console.log(err);
                        fail(err);
                    } else {
                        success(row);
                    }
                }
            );
        });
    }

    all(columns, conditions, success, fail) {
        exec(columns, conditions, (cols, cons, vals) => {
            let sql = `SELECT ${cols.join(',')} FROM ${this.table} `;
            if (cons.length !== 0) {
                sql += `WHERE ${cons.join(' AND ')}`;
            }
            db.all(
                sql, vals,
                (err, rows) => {
                    if (err) {
                        fail(err);
                    } else {
                        success(rows);
                    }
                }
            );
        });
    }

    update(updates, conditions, success, fail) {
        let cols = [];
        let newVals = [];

        let parseObjConditions = obj => {
            obj.forEach((k, v) => {
                cols.push(`${k}=?`);
                newVals.push(v);
            })
        };

        if (updates instanceof Array) {
            for (let item of updates) {
                if (typeof item === 'string') {
                    cols.push(item);
                } else {
                    parseObjConditions(item);
                }
            }
        } else if (typeof updates === 'string') {
            cols.push(updates);
        } else {
            parseObjConditions(updates);
        }

        exec([], conditions, (_, cons, vals) => {
            console.log(`UPDATE ${this.table} SET ${cols.join(',')} WHERE ${cons.join(' AND ')}`);
            console.log(newVals.concat(vals));
            db.run(
                `UPDATE ${this.table} SET ${cols.join(',')} WHERE ${cons.join(' AND ')}`,
                newVals.concat(vals),
                err => {
                    if (err) {
                        fail(err);
                    } else {
                        success();
                    }
                }
            )
        });
    }

    delete(conditions, success, fail) {
        exec([], conditions, (_, cons, vals) =>
            db.run(`DELETE FROM ${this.table} WHERE ${cons.join(' AND ')}`, vals, err => {
                if (err) {
                    fail(err);
                } else {
                    success();
                }
            })
        );
    }
}

function createParam(length) {
    let param = new Array(length);
    param.fill('?');
    return param.join(',');
}

function exec(columns, conditions, callback) {
    let cols = [];
    let cons = [];
    let vals = [];

    let parseObjColumns = obj => obj.forEach((k, v) => cols.push(`${k} AS ${v}`));

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

    let parseObjConditions = obj => {
        obj.forEach((k, v) => {
            cons.push(`${k}=?`);
            vals.push(v);
        })
    };

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

    callback(cols, cons, vals);
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
            if (Number.isInteger(size) && size > 0) {
                return `${type}(${size})`;
            } else {
                throw 'size should be a positive integer';
            }
        },
        enumerable: true
    }
}

Object.defineProperties(exports, propDef);
