'use strict';

const bluetooth = require('bluetooth-serial-port');
const localIP = require('./LocalIP');

function findDevice (deviceName) {
    const btSerial = new bluetooth.BluetoothSerialPort();

    var index = 0;
    var deviceFound = false;

    btSerial.on('found', (address, name) => {
        console.log(index.toString(), address, name);
        index++;
        if (name === deviceName) {
            deviceFound = true;
            btSerial.findSerialPortChannel(address, channel => {
                console.log('channel found:', address, channel);
                btSerial.connect(address, channel, () => {
                    console.log('connected:', address, channel);

                    btSerial.write(new Buffer(localIP.IPv4, 'utf-8'), (err, bytesWritten) => {
                        console.log('send', ip);
                        if (err) {
                            console.log(err);
                        }
                    });

                    btSerial.on('data', buffer => {
                        var data = buffer.toString('utf-8');
                        console.log('receive', data);
                        if (data === localIP.IPv4) {
                            btSerial.close();
                        }
                    });
                });
            }, () => console.log('cannot connect'));
        }
    }, () => console.log('found nothing'));

    btSerial.on('finished', () => {
        if (deviceFound) {
            console.log(deviceName, 'found');
        } else {
            console.log(deviceName, 'not found');
            // retry
            setTimeout(() => findDevice(deviceName), 1000);
        }
        btSerial.close();
    });
    btSerial.inquire();
};

exports.findDeivce = findDevice;