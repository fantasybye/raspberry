
var rp = require('request-promise');
//var http = require('http');

var dateformat = require('./dateFormat');

exports.dataPost = function(deviceid, sensorid, sensordata, key) {
  
  var date = dateformat.getNowFormatDate();
  console.log(date);
  var body = {
    timestamp: date,
    value: sensordata
  };
  //var bodyStr = JSON.stringify(body);

  var options = {
    method: 'POST',
    url: `http://localhost:3000/device/${deviceid}/sensor/${sensorid}/datapoints`,
    body: {
      timestamp: date,
      value: parseFloat(sensordata),
    },
    headers: {
      'U-ApiKey': key,
      'Content-Type': 'application/json',
      //'Content-Length': bodyStr.length,
    },
    json: true
  };

  rp(options).then((response) => {
    console.log('yes');
    console.log(response);
  }).catch((err) => {
    console.log(err);
  });
  //var req = http.request(options, (res) => {
    //res.charset = 'utf-8';
    //console.log('yes');
  //});
  //req.write(bodyStr);
  //req.end();

}
