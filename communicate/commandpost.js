
var rp = require('request-promise');
//var http = require('http');

var dateformat = require('./dateFormat');

exports.commandPost = function(deviceid, sensorid, sensordata) {
  
  var date = dateformat.getNowFormatDate();
  //var body = {
    //timestamp: date,
    //state: sensordata
  //};
  //var bodyStr = JSON.stringify(body);

  var options = {
    method: 'POST',
    url: `http://localhost:3000/device/${deviceid}/sensor/${sensorid}/datapoints`,
    body: {
      timestamp: date,
      state: sensordata,
    },
    headers: {
      'U-ApiKey': 'd0e17a2be2614d08ade2a956e9873270',
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
