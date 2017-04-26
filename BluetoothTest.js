'use strict';

const connector = require('./BluetoothConnector');

const myDeviceName = 'BL-SLAVE';
connector.findDeivce(myDeviceName);