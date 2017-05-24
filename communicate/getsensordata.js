
var Cylon = require('cylon');
var sqlite3 = require('sqlite3').verbose();
var readline = require('readline');
var rp = require('request-promise');

var datapost = require('./datapost');
var genericpost = require('./genericpost');

Cylon.robot ({

  connections: {
    server: { adaptor: 'mqtt', host: 'mqtt://localhost:1883'}
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
          judgeandtrans(userkey);
        }
      }).catch((res) => {
        console.log(res);
      });
    });

    function judgeandtrans(key) {
      var getchannels = function(callback) {
        var db = new sqlite3.Database('aboutchannel');
        var sentence = "SELECT channelname FROM channels WHERE channeltype = 0";
        db.all(sentence, function(err, res) {
          if(!err) {
            //console.log(res);
            callback(res);
          }else {
            console.log(err);
          }
        });
        db.close();
      }

      getchannels(function(result) {
        for(var channel of result) {
          //console.log(channel);
          my.server.subscribe(channel.channelname);
        }
      });

      my.server.on('message', function(topic, data) {
        //console.log('okey');
        console.log(topic + ":" + data);
        var db = new sqlite3.Database('aboutchannel');
        var sentence = "SELECT deviceid, sensorarray FROM channels WHERE channelname = '" + topic + "'";
        db.all(sentence, function(err, res) {
          if(!err) {
            res = res[0];
            var deviceid = res.deviceid;

            var setsensors = eval('('+res.sensorarray+')');
            var setlength = setsensors.length;

            var message = eval('('+data+')');
            
            var themessage = JSON.stringify(message[0]);
            var getsensors = themessage.split(",");
            var getlength = getsensors.length;
            var checksensors = new Array();
            for(var i = 0; i < getlength; i++) {
              var one = getsensors[i].replace(/\s+/g,"");
              if(i === 0) {
                one = one.substring(1);
              }
              if(i === getlength - 1) {
                var onelength = one.length;
                one = one.substring(0, onelength - 1);
              }
              var oneid = one.split(":")[0].replace(/\s+/g,"");
              var onedata = one.split(":")[1].replace(/\s+/g,"");
              var idlength = oneid.length;
              var datalength = onedata.length;
              oneid = oneid.substring(1, idlength - 1);
              onedata = onedata.substring(1, datalength - 1);
              checksensors.push({id:`${oneid}`,data:`${onedata}`});
            }
          
            var transdata = new Array();
            var checklength = checksensors.length;
            var over = new Array();
            for(var i = 0; i < checklength; i++) {
              var checkid = checksensors[i].id;
              var checkdata = checksensors[i].data;
              for(var j = 0; j < setlength; j++) {
                var setid = setsensors[j].id;
                var settype = setsensors[j].type;
                if(checkid === setid) {
                  transdata.push({id:`${checkid}`,data:`${checkdata}`,type:`${settype}`});
                  break;
                }else{
                  if(j === setlength - 1) {
                    over.push(checkid);
                  }else {
                    continue;
                  }
                }
              }
            }
            var lack = new Array();
            for(var i = 0; i < setlength; i++) {
              var setid = setsensors[i].id;
              for(var j = 0; j < checklength; j++) {
                var checkid = checksensors[j].id;
                if(setid === checkid) {
                  break;
                }else {
                  if(j === checklength - 1) {
                    lack.push(setid);
                  }else {
                    continue;
                  }
                }
              }
            }

            var overlength = over.length;
            var lacklength = lack.length;
            if((overlength === 0) && (lacklength === 0)) {
              for(var send of transdata) {
                var sensorid = send.id;
                var sensortype = send.type;
                var sensordata = send.data;
                //if(sensortype === 'num') {
                  //sensordata = parseInt(sensordata, 10);
                //}
                //console.log(sensortype);
                //console.log(sensorid);
                //console.log(sensordata);
                //console.log(deviceid);
                switch (sensortype) {
                  case '0':
                    //console.log(sensordata);
                    datapost.dataPost(deviceid, sensorid, sensordata, key);
                    break;
                  case '8':
                    genericpost.genericPost(deviceid, sensorid, sensordata, key);
                    break;
                  default:
                    console.log('unhandled type of sensor');
                    break;
                }
                
              } 
            }else {
              for(var one of over) {
                console.log(one + ' has not been set into the channel, the data will not been transferred, please add it to the channel first'); 
              }
              for(var one of lack) {
                console.log(one + 'is not in the data, the data will not been transferred, please check the sensor');
              }
            }
          }else {
            console.log(err);
          }
        });
        db.close();
      });

     //});
    }

    
  }

}).start();
