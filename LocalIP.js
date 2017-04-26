'use strict';

const os = require('os');
const ifaces = os.networkInterfaces();

function getAddress(type, defaultValue) {
    for (var ifname of Object.keys(ifaces)) {
        for (var iface of ifaces[ifname]) {
            if (iface.family === type && iface.internal === false) {
                return iface.address;
            }
        }
    }
    return defaultValue;
}

Object.defineProperties(exports, {
    'IPv4': {
        get: () => getAddress('IPv4', '127.0.0.1')
    },
    'IPv6': {
        get: () => getAddress('IPv6', '::1')
    }
});