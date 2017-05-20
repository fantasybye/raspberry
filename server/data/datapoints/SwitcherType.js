'use strict';

const db = require('../Schema');
const utils = require('../Utils');

const switcherData = new Db('switcher_data', {
    id: {
        type: INTEGER,
        attr: [PK, AUTO_INC]
    },
    device_id: {
        type: INTEGER,
        attr: NOT_NULL
    },
    sensor_id: {
        type: INTEGER,
        attr: NOT_NULL
    },
    timestamp: {
        type: INTEGER,
        attr: NOT_NULL
    },
    state: {
        type: INTEGER,
        attr: NOT_NULL
    },
    fetched: {
        type: INTEGER,
        attr: NOT_NULL,
        defaultValue: 0
    }
});

exports.name = 'switcher';
exports.id = 5;

exports.add = (apiKey, deviceId, sensorId, info, success, fail) => {
    if (!info || info.state === undefined || info.state === null) {
        if (info.value !== undefined || info.value !== null) {
            fail({ 'ERROR': 'switcher use state instead of value' });
        } else {
            fail({ 'ERROR': 'state is required' });
        }
        return;
    } else if (Number.isInteger(info.state)) {
        fail({ 'ERROR': 'state should be integer' });
        return;
    }

    let state = info.state;
    let time = utils.toTime();
    switcherData.insert({ device_id: deviceId, sensor_id: sensorId, timestamp: time, state: state },
        err => {
            if (err) {
                fail(err);
            } else {
                success();
            }
        }
    );
}

// lastest
exports.get = (apiKey, deviceId, sensorId, _, success, fail) => {
    db.get(
        'SELECT timestamp, state FROM switcher_data WHERE sensor_id=? ORDER BY timestamp DESC LIMIT 1',
        sensorId,
        (err, row) => {
            if (err) {
                fail(err);
            } else {
                if (!row) {
                    success({
                        timestamp: utils.toISOTime(0),
                        state: 0,
                        sensor_id: sensorId,
                        device_id: deviceId
                    });
                } else {
                    success({
                        timestamp: utils.toISOTime(row.timestamp),
                        state: row.state,
                        sensor_id: sensorId,
                        device_id: deviceId
                    });
                }
            }
        }
    );
};

exports.allUnfetched = (apiKey, success, fail) => {
    db.all(
        `SELECT
s.device_id AS device_id,
s.sensor_id AS sensor_id,
s.timestamp AS timestamp,
s.state AS state
FROM device d
JOIN switcher_data s ON d.id=s.device_id
WHERE d.api_key=?
  AND fetched=0
GROUP BY sensor_id
ORDER BY s.timestamp DESC`,
        apiKey,
        (err, rows) => {
            if (err) {
                fail(err);
            } else {
                db.run(`UPDATE switcher_data SET fetched=1
WHERE exists (SELECT null FROM device d WHERE d.api_key=? AND d.id=switcher_data.device_id)
  AND fetched=0`,
                    apiKey,
                    err => {
                        if (err) {
                            fail(err);
                        } else {
                            let commands = [];
                            for (let row of rows) {
                                let command = {
                                    device_id: row.device_id,
                                    sensor_id: row.sensor_id,
                                    timestamp: utils.toISOTime(row.timestamp),
                                    state: row.state
                                };
                                commands.push(command);
                            }
                            success(commands);
                        }
                    }
                );
            }
        }
    )
};

exports.update = (apiKey, deviceId, sensorId, _, info, success, fail) => {
    if (!info || info.state === undefined) {
        if (info.value !== undefined || info.value !== null) {
            fail({ 'ERROR': 'switcher use state instead of value' });
        } else {
            fail({ 'ERROR': 'state is required' });
        }
        return;
    } else if (Number.isInteger(info.state)) {
        fail({ 'ERROR': 'state should be integer' });
        return;
    }
    let time = utils.toTime();
    switcherData.insert({ device_id: deviceId, sensor_id: sensorId, timestamp: time, state: info.state, fetched: 1 },
        err => {
            if (err) {
                fail(err);
            } else {
                success();
            }
        }
    );
};

exports.delete = (apiKey, deviceId, sensorId, timestamp, success, fail) => {
    fail({ 'ERROR': 'NOT SUPPORT' });
};

exports.history = (apiKey, deviceId, sensorId, start, end, page, success, fail) => {
    const pageSize = 200;

    page = page !== undefined ? page : 1;

    let startTime = new Date(start).getTime() / 1000;
    let endTime = new Date(end).getTime() / 1000;
    let offset = (page - 1) * pageSize;
    let limit = pageSize;
    db.all(
        'SELECT timestamp, state FROM switcher_data WHERE sensor_id=? AND timestamp BETWEEN ? AND ? ORDER BY timestamp DESC LIMIT ?, ?',
        [sensorId, startTime, endTime, offset, limit],
        (err, rows) => {
            if (err) {
                fail(err);
            } else {
                let result = [];
                for (let row of rows) {
                    result.push({ timestamp: utils.toISOTime(row.timestamp), state: row.state });
                }
                success(result.reverse());
            }
        }
    );
};
