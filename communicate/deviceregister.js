
var rp = require('request-promise');
var readline = require('readline');

exports.deviceRegister = function(key) {

  var readdevice = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  console.log('please input the message of the device as title.about.tags.local, and for tags please input array, or input exit to leave:');
  readdevice.on('line', (input) => {
    switch (input)
    {
      case 'exit':
        readdevice.close();
        break;
      default:
        var registertitle = input.split(".")[0];
        var registerabout = input.split(".")[1];
        var registertags = input.split(".")[2];
        var registerlocal = input.split(".")[3];
        var options = {
          method: 'POST',
          url: `http://localhost:3000/devices`,
          body: {
            title: registertitle,
            about: registerabout,
            tags: registertags,
            local: registerlocal,
          },
          headers: {
            'U-ApiKey': key,
            'Content-Type': 'application/json',
          },
          json: true
        };
        rp(options).then((response) => {
          var deviceid = response.device_id;
          console.log(deviceid);
          console.log('input message of device again, or input exit to leave');
        }).catch((err) => {
          console.log(err);
        });
        break;
    }
  });

}

