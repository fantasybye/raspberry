
var async = require('async');
const rp = require('request-promise');

var readline = require('readline');
var sqlite3 = require('sqlite3').verbose();

var addsensor = require('./addsensor');
//var conornot = require('./configurechannel');

exports.addChannel = function(userkey) {
  
  //var channeltype;
  //var channelname;
  //var deviceid;
  //var devicename;

  var key = userkey;

  getchanneltype();

  function getchanneltype(){
    var channeltype;
    var readchanneltype = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    console.log('please select the type of the channel: 1.sensor value, 2.direction');
    readchanneltype.on('line', (input) => {
      switch (input)
      {
        case '1':
          channeltype = '0';
          readchanneltype.close();
          getdeviceid(channeltype);
          break;
        case '2':
          channeltype = '1';
          readchanneltype.close();
          getdeviceid(channeltype);
          break;
        default:
          console.log('error input, please input 1 or 2');
          break;
      }
    }); 
  }

  function getdeviceid(channeltype){
    var deviceid;
    var devicename;

    //get all devices that are in the database
    var getdeviceids = function(callback) {
      var deviceids = new Array();
      const options = {
        method: 'GET',
        url: 'http://localhost:3000/devices',
        //hostname: `192.168.75.125`,
        //port: 3000,
        //path: `/devices`,
        headers: {
          'U-ApiKey': key,
          'Content-Type': 'application/json',
        },
        json: true
      };
      rp(options).then((response) => {
        console.log('get device');
        //console.log(JSON.stringify(response));
        var devices = response;
        for(var device of devices){
          var id = device.id;
          var title = device.title;
          //deviceids.push('{id:'+item.devid+'}');
          deviceids.push({id:`${id}`,title:`${title}`});
          //deviceids.push(id);
        }
        callback(deviceids);
      }).catch((err) => {
        console.log(err);
      });
    }

    getdeviceids(function(result) {
      //device id input
      var readdeviceid = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      console.log('please input the id and the name of the device that you want to add channel to as id.name, or input exit to leave');

      readdeviceid.on('line', (input) => {
        if(input === 'exit') {
          readdeviceid.close();
        }else{
          //console.log(`input: ${input}`);
          var inputid = input.split(".")[0];
          var inputname = input.split(".")[1];
          //console.log('input:'+inputid+',name:'+inputname);
          for(var i = 0;i < result.length; i++) {
            var dev = result[i];
            //console.log(dev.id+','+dev.title);
            if((inputid === dev.id) && (inputname === dev.title)) {
              var deviceid = inputid;
              var devicename = inputname;
              readdeviceid.close();
              getchannelname(channeltype,deviceid,devicename);
              break;
            }else{
              if(i === result.length - 1) {
                console.log('The device has not been registered!');
              }else{
                continue;
              }
            }
          }
        }
      });
    });
    
    

  }

  function getchannelname(channeltype,deviceid,devicename){
    var names = new Array();
    //var getallnames = function(callback) {
      //lookchannel.allName(function(result) {
        //callback(result);
      //});
    //}
    lookchannel.allName(function(result) {
      for(var one of result) {
        names.push(one.channelname);
      }
      var readchannelname = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      console.log('The name of the channel:');
      readchannelname.on('line', (input) => {
        if(names.length === 0) {
          readchannelname.close();
          var sensorarray = new Array();
          var db = new sqlite3.Database('aboutchannel');
          var sentence = "INSERT INTO channels VALUES( '" + input + "', '" + channeltype + "', '" + deviceid + "', '" + devicename + "', '" + JSON.stringify(sensorarray) + "')";
          db.all(sentence, function(err, res) {
            if(!err) {
              console.log('save success');
              judgenext(input, deviceid, channeltype);
            }else {
              console.log(err);
            }
          });
          db.close();
        }
        for(var i = 0; i < names.length; i++) {
          if(input === names[i]) {
            console.log('repeat name, please set again');
            break;
          }else{
            if(i === names.length - 1) {
              readchannelname.close();
              var db = new sqlite3.Database('aboutchannel');
              var sentence = "INSERT INTO channels VALUES( '" + input + "', '" + channeltype + "', '" + deviceid + "', '" + devicename + "', '" + JSON.stringify(sensorarray) + "')";
              db.all(sentence, function(err, res) {
                if(!err) {
                  console.log('save success');
                  judgenext(input, deviceid, channeltype);
                }else {
                  console.log(err);
                }
              });
              db.close();
            }else{
              continue;
            }
          }
        }
      });
    });
    
  }

  function judgenext(channelname, deviceid, channeltype) {
    var readnext = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    readnext.question('Do you want to add some sensors to the channel: 1.yes, 3.leave', (answer) => {
      switch (answer)
      {
        case '1':
          readnext.close();
          addsensor.addSensor(channelname, deviceid, channeltype, key);
          break;
        case '2':
          readnext.close();
          //conornot.continueoperation();
          break;
        case '3':
          readnext.close();
          //conornot.continueopeartion();
          break;
        default:
          readnext.close();
          break;
      }
    });
  }

}
