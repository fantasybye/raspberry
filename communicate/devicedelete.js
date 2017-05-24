
var readline = require('readline');
var rp = require('request-promise');
var sqlite3 = require('sqlite3').verbose();

exports.deviceDelete = function(key) {

  var getdeviceids = function(callback) {
    var options = {
      method: 'GET',
      url: `http://localhost:3000/devices`,
      headers: {
        'U-ApiKey': key,
        'Content-Type': 'application/json',
      },
      json: true
    };
    rp(options).then((response) => {
      var devices = new Array();
      for(var device of response) {
        devices.push(device.id);
      }
      callback(devices);
    }).catch((err) => {
      console.log(err);
    });
  }

  getdeviceids(function(devices) {
    var readdelete = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    console.log('please input the id of the device you want to delete, or input exit to leave');
    readdelete.on('line', (input) => {
      switch (input) 
      {
        case 'exit':
          readdelete.close();
          break;
        default:
          var deleteid = Number(input);
          for(var i = 0; i < devices.length; i++) {
            if(deleteid === devices[i]) {
              var options = {
                method: 'DELETE',
                url: `http://localhost:3000/device/${deleteid}`,
                headers: {
                  'U-ApiKey': key,
                  'Content-Type': 'application/json',
                },
                json: true
              };
              rp(options).then((response) => {
                //console.log('delete device success, input another device or input exit to leave');
                devices.splice(i,1);
                var db = new sqlite3.Database('aboutchannel');
                var sentence = "SELECT * FROM channels WHERE deviceid = '" + deleteid + "'";
                db.all(sentence, function(err, res) {
                  if(res.length === 0) {
                    console.log('delete device success, and there is no channel to it, please input another device or input exit to leave');
                  }else {
                    var deletesentence = "DELETE FROM channels WHERE deviceid = '" + deleteid + "'";
                    db.all(deletesentence, function(err, res) {
                      if(!err) {
                        console.log('delete device and its channels success, please input another device or input exit to leave');
                      }else {
                        console.log(err);
                      }
                    });
                  }
                });
                //db.close();
              }).catch((err) => {
                console.log(err);
              });
            }else {
              if(i === devices.length - 1) {
                console.log('the device has not been registered, please enter another device id, or input exit to leave');
              }else {
                continue;
              }
            }
          }
          break;
      }
    });
  });
  

}
