
var readline = require('readline');
var rp = require('request-promise');
var sqlite3 = require('sqlite3').verbose();

exports.sensorDelete = function(deviceid, key) {

  var getsensors = function(callback) {
    var options = {
      method: 'GET',
      url: `http://localhost:3000/device/${deviceid}/sensors`,
      headers: {
        'U-ApiKey': key,
        'Content-Type': 'application/json',
      },
      json: true
    };
    rp(options).then((response) => {
      //console.log(response);
      var devsen = new Array();
      for(var res of response) {
        devsen.push(res.id);
      }
      callback(devsen);
    }).catch((err) => {
      console.log(err);
    });
  }

  getsensors(function(sensors) {
    var readdelete = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    console.log('please input the id of the sensor you want to delete, or input exit to leave');
    readdelete.on('line', (input) => {
      //console.log('input:'+input);
      switch(input)
      {
        case 'exit':
          readdelete.close();
          break;
        default:
          //console.log('input');
          //console.log(sensors.length);
          var deletesensor = Number(input);
          for(var i = 0; i < sensors.length; i++) {
            console.log(sensors[i]);
            if(deletesensor === sensors[i]) {
              var options = {
                method: 'DELETE',
                url: `http://localhost:3000/device/${deviceid}/sensor/${deletesensor}`,
                headers: {
                  'U-ApiKey': key,
                  'Content-Type': 'application/json',
                },
                json: true
              };
              rp(options).then((response) => {
                //console.log('okay');
                sensors.splice(i,1);
                var db = new sqlite3.Database('aboutchannel');
                var selectsentence = "SELECT channelname, sensorarray FROM channels WHERE deviceid = '" + deviceid + "'";
                db.all(selectsentence, function(err, res) {
                  if(!err) {
                    //console.log(res);
                    if(res.length === 0) {
                      console.log('delete sensor success, there is no channel to its device, please input another sensor id or input exit to leave');
                    }else {
                      var channelsensors = new Array();
                      for(var one of res) {
                        var onename = one.channelname;
                        var onearray = one.sensorarray;
                        channelsensors.push({channelname:`${onename}`,sensorarray:`${onearray}`});
                      }
                      //console.log(channelsensors);
                      //console.log(channelsensors.length);
                      for(var j = 0; j < channelsensors.length; j++) {
                        var thesensors = channelsensors[j].sensorarray;
                        thesensors = eval('('+thesensors+')');
                        console.log(thesensors.length);
                        for(var t = 0; t < thesensors.length; t++) {
                          console.log('one');
                          console.log(thesensors[t]);
                          console.log('delete:'+ typeof deletesensor);
                          console.log('save:'+ typeof thesensors[t].id);
                          if(deletesensor === Number(thesensors[t].id)) {
                            console.log('delete sensor success, and please delete the sensor from the channel' + channelsensors[j].channelname);
                          }
                        }
                      }
                    }
                  }else {
                    console.log(err);
                  }
                });
              }).catch((err) => {
                console.log(err);
              });
            }else {
              if(i === sensors.length - 1) {
                console.log('the sensor does not belong to the device, please input another sensor or input exit to leave');
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
