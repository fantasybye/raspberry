
var rp = require('request-promise');
var readline = require('readline');

exports.sensorRegister = function(key) {

  var getdevices = function(callback) {
    var deviceids = new Array();
    var options = {
      method: 'GET',
      url: 'http://localhost:3000/devices',
      headers: {
        'U-ApiKey': key,
        'Content-Type': 'application/json',
      },
      json: true
    };
    rp(options).then((response) => {
      console.log('get device');
      //console.log(response);
      for(var device of response){
        var id = device.id;
        deviceids.push(id);
      }
      callback(deviceids);
    }).catch((err) => {
      console.log(err);
    });
  }

  getdevices(function(result) {
    var readsensor = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    console.log('please input the message of sensor as device_id.type.title.about.tags.unit_name.unit_symbol, as for type 0 present value 5 present switch 8 present generic, or input exit to leave');
    readsensor.on('line', (input) => {
      switch (input)
      {
        case 'exit':
          readsensor.close();
          break;
        default:
          var device_id = input.split(".")[0];
          var type = input.split(".")[1];
          var title = input.split(".")[2];
          var about = input.split(".")[3];
          var tags = input.split(".")[4];
          var unit_name = input.split(".")[5];
          var unit_symbol = input.split(".")[6];
          //console.log(device_id);
          device_id = Number(device_id);
          type = Number(type);
          for(var i = 0; i < result.length; i++) {
            //console.log('use for check' + result[i]);
            if(device_id === result[i]) {
              var options = {
                method: 'POST',
                url: `http://localhost:3000/device/${device_id}/sensors`,
                body: {
                  device_id: device_id,
                  type: type,
                  title: title,
                  about: about,
                  tags: tags,
                  unit_name: unit_name,
                  unit_symbol: unit_symbol,
                },
                headers: {
                  'U-ApiKey': key,
                  'Content-Type': 'application/json',
                },
                json:true
              };
              rp(options).then((response) => {
                var sensorid = response.sensor_id;
                console.log(sensorid);
                console.log('register continuously or input exit to leave');
              }).catch((err) => {
                console.log(err);
              });
              break;
            }else{
              if(i === result.length - 1) {
                console.log('The device has not been registered, please set device again or input exit to leave');
              }else {
                continue;
              }
            }
          }
      }
    });
  });

}
