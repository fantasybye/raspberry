const url = require('url');
const http = require('http');
const dateFormat = require('./dateFormat');

exports.dataPost = function func(devId, senId, monitorValue) {
// 相邻的数据上传间隔时间需要大于10s
// 设备号 devId, 传感器号 senId, 键值monitorValue

// 获取当前系统时间并转换为timestamp格式
  console.log('test:'+devId);
  console.log('test:'+senId);
  console.log('test:'+monitorValue);
  const date = dateFormat.getNowFormatDate();
// POST url
  //const urlStr = 'http://192.168.75.125:3000/devices/${devId}/sensor/${senId}/datapoints';
  //const urlData = url.parse(urlStr);
// POST 内容
  const body = {
    timestamp: date,
    value: parseInt(monitorValue, 10),
  };
  const bodyStr = JSON.stringify(body);


  const options = {
    //hostname: urlData.hostname,
    hostname:`192.168.75.125`,
    port:3000,
    path: `/device/${devId}/sensor/${senId}/datapoints`,
    method: 'POST',
    headers: {
      'U-ApiKey': '0e8eee547fcb48c7a28beca2c437f4b2',
      'Content-Type': 'application/json',
      'Content-Length': bodyStr.length,
    },
  };

  const req = http.request(options, (res) => {
    res.charset = 'utf-8';
    /* let responseStr = '';
     res.on('temperature', (temperature) => {
     responseStr += temperature;
     });

     res.on('end', () => {
     const resultObject = JSON.parse(responseStr);
     console.log('-----resBody-----', resultObject);
     });

     req.on('error', () => {
     console.log('error!');
     }); */
  });
  req.write(bodyStr);
  req.end();
};
