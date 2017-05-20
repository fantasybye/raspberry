
var rp = require('request-promise');

exports.directionGet = function(key, callback) {

  var options = {
    method: 'GET',
    url: `http://localhost:3000/commands`,
    headers: {
      'U-ApiKey': key,
      'Content-Type': 'application/json',
    },
    json:true
  };
  rp(options).then((response) => {
    callback(response);
  }).catch((err) => {
    console.log(err);
  });

}
