
var rp = require('request-promise');
//var http = require('http');

var dateformat = require('./dateFormat');

exports.genericPost = function(deviceid, sensorid, sensordata, userkey) {
  
  var date = dateformat.getNowFormatDate();
  console.log(date);
  var body = {
    key: date,
    value: sensordata
  };
  //var bodyStr = JSON.stringify(body);

  var options = {
    method: 'POST',
    url: `http://localhost:3000/device/${deviceid}/sensor/${sensorid}/datapoints`,
    body: {
      key: date,
      value: sensordata,
    },
    headers: {
      'U-ApiKey': userkey,
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
