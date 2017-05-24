
var Cylon = require('cylon');
var sqlite3 = require('sqlite3').verbose();
var readline = require('readline');
var rp = require('request-promise');

var directionget = require('./directionget');

Cylon.robot({

  connections: {
    directionserver: { adaptor: 'mqtt', host: 'mqtt://localhost:1883'}
  },

  work: function(my) {

    var readlogin = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    console.log('please input your username and password as username.password');
    readlogin.on('line', (input) => {
      var inputname = input.split(".")[0];
      var inputpassword = input.split(".")[1];
      const options = {
        method: 'POST',
        url:`http://localhost:3000/apikey`,
        body: {
          username: inputname,
          password: inputpassword,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        json: true
      };
      rp(options).then((response) => {
        var userkey = response.api_key;
        if(userkey === undefined) {
          console.log('error username or password, input again or input exit to leave');
        }else {
          readlogin.close();
          senddirection(userkey);
        }
      }).catch((res) => {
        console.log(res);
      });
    });

    function senddirection(key) {
      every((5).seconds(), function() {
        directionget.directionGet(key, function(result) {
          //console.log(result);

          findpubchannel(function(channels) {
            for(var command of result) {
              var deviceid = command.device_id;
              var sensorid = command.sensor_id;
              var direction = command.state;
              //console.log('commanddevice:'+deviceid);
              //console.log('commandsensor:'+sensorid);
              for(var i = 0; i < channels.length; i++) {
                //console.log(JSON.stringify(channels[i]));
                var saveddevice = channels[i].deviceid;
                var savedsensor = eval('('+channels[i].sensorarray+')');
                var savedsensorid = Number(savedsensor[0].id);
                //console.log('savedevice:'+saveddevice);
                //console.log('savesensor:'+savedsensorid);
                if(deviceid === saveddevice) {
                  console.log('device ok');
                }
                if(sensorid === savedsensorid) {
                  console.log('sensor ok');
                }
                //console.log(typeof sensorid);
                //console.log(typeof savedsensorid);
                if(deviceid === saveddevice && sensorid === savedsensorid) {
                  //if(sensorid === savedsensorid) {
                    console.log('send');
                    my.directionserver.publish(channels[i].channelname, direction);
                    break;
                  //}
                }else {
                  if(i === channels.length - 1) {
                    //console.log('There is no channel for the device ' + deviceid + ' to send directions.');
                    console.log('There is no channel for the direction');
                  }else {
                    continue;
                  }
                }
              }
            }
          });
          
        });
      });
    }

    function findpubchannel(callback) {
      var db = new sqlite3.Database('aboutchannel');
      var selectsentence = "SELECT * from channels WHERE channeltype = 1 ";
      db.all(selectsentence, function(err, res) {
        if(!err) {
          callback(res);
        }else {
          console.log(err);
        }
      });
    }

  }

}).start();
