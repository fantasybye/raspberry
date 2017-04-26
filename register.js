const url = require('url');
const http = require('http');
const Sqlope = require('./sqlope');

var deviceId;
var sensorId;

exports.devRegister = function func(devTitle, devAbout,regTime) {
  // 用于注册设备
  const urlStr = 'http://api.yeelink.net/v1.0/devices';
  const urlData = url.parse(urlStr);
  const devInfo = {
    title: devTitle,
    about: devAbout,
    tags: ['arduino', 'device'],
    location: {
      local: 'Nanjing',
      latitude: 118.78,
      longitude: 32.04,
    },
  };
  const devInfoStr = JSON.stringify(devInfo);
  const options = {
    hostname: urlData.hostname,
    path: urlData.path,
    method: 'POST',
    headers: {
      'U-ApiKey': '6441e70eefc58fea0b1e938abf946a28',
      'Content-Type': 'application/json',
      'Content-Length': devInfoStr.length,
    },
  };
  const req = http.request(options, (res) => {
    res.charset = 'utf-8';
    res.on('data', (chunk) => {
      deviceId = chunk.toString().substring(13, 19);
      const sqlope = new Sqlope();
      sqlope.savedev(deviceId,devTitle,devAbout,regTime);
    });
  });
  req.write(devInfoStr);
  req.end();
};

exports.senRegister = function func(devId, senTitle, senAbout, senUnit, senSymbol,regTime) {
  // 用于注册传感器
  const urlStr = `http://api.yeelink.net/v1.0/device/${devId}/sensors`;
  const urlData = url.parse(urlStr);
  const senInfo = {
    type: 'value',
    title: senTitle,
    about: senAbout,
    tags: ['arduino', 'sensor'],
    unit: {
      name: senUnit,
      symbol: senSymbol,
    },
  };
  const senInfoStr = JSON.stringify(senInfo);
  const options = {
    hostname: urlData.hostname,
    path: urlData.path,
    method: 'POST',
    headers: {
      'U-ApiKey': '6441e70eefc58fea0b1e938abf946a28',
      'Content-Type': 'application/json',
      'Content-Length': senInfoStr.length,
    },
  };
  const req = http.request(options, (res) => {
    res.charset = 'utf-8';
    res.on('data', (chunk) => {
      // console.log(chunk.toString().substring(13, 19));
      sensorId = chunk.toString().substring(13, 19);
      const sqlope = new Sqlope();
      sqlope.savesensor(sensorId,devId,senTitle,senAbout,senUnit,senSymbol,regTime);
    });
  });
  req.write(senInfoStr);
  req.end();
};
