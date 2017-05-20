
var rp = require('request-promise');

var readline = require('readline');

var sqlite3 = require('sqlite3').verbose();

//var conornot = require('./configurechannel');

exports.addSensor = function(channelname, deviceid, channeltype, key) {

  console.log('channeltype:'+channeltype);

  const options = {
    method: 'GET',
    url: `http://localhost:3000/device/${deviceid}/sensors`,
    //hostname: `192.168.75.125`,
    //port: 3000,
    //path: `/device/${deviceid}/sensors`,
    body: {
      device_id: deviceid,
    },
    headers: {
      'U-ApiKey': key,
      'Content-Type': 'application/json',
    },
    json: true
  };

  rp(options).then((response) => {
    console.log('get sensors of ' + deviceid);
    //var sensors = response;
    //console.log(response);
    var sen_idtypeduty = new Array();
    for(var sensor of response) {
      //console.log(sensor);
      var sensorid = sensor.id;
      var sensorname = sensor.title;
      var sensortype = sensor.type;
      //console.log(sensorid);
      sen_idtypeduty.push({id:`${sensorid}`, duty:`${sensorname}`, type:`${sensortype}`});
    }
    
    var readsensor = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    console.log('plese input the sensor message what you want to add to the channel as id.duty.type for the type, 0 present value, 8 present generic, 5 present switch, and if you want to leave, please input exit');
    var addsensors = new Array();
    readsensor.on('line', (input) => {
      
      if(input === 'exit') {
        if(addsensors.length === 0) {
          //console.log('no sensor');
          readsensor.close();
        }else{
          var db = new sqlite3.Database('aboutchannel');
          var updatesentence = "UPDATE channels SET sensorarray = '" + JSON.stringify(addsensors) + "' WHERE channelname = '" + channelname + "'";
          db.all(updatesentence, function(err,res) {
            if(!err){
              console.log('add sensor success');
            }else{
              console.log(err);
            }
          });
          db.close();
          readsensor.close();
          //conornot.continueoperation();
        }
        
      }else {
        var inputid = input.split(".")[0].replace(/\s+/g,"");
        var inputduty = input.split(".")[1].replace(/\s+/g,"");
        var inputtype = input.split(".")[2].replace(/\s+/g,"");
        //console.log('inputid:'+inputid);
        for(var i = 0; i < sen_idtypeduty.length; i++) {
          var thesensor = sen_idtypeduty[i];
          //console.log('exist duty:' + thesensor.duty);
          //if(inputid === thesensor.id) {
            //console.log('id yes');
          //}
          //if(inputduty === thesensor.duty) {
            //console.log('id yes');
          //}
          //if(inputtype === thesensor.type) {
            //console.log('id yes');
          //}
          if((inputid === thesensor.id) && (inputduty === thesensor.duty) && (inputtype === thesensor.type)) {
            //console.log('yes');
            if(channeltype === '1') {
              console.log('channel pub');
            }
            if(inputtype === '5') {
              console.log('input pub');
            }
            if((channeltype === '0') && (inputtype === '0' || inputtype === '8')){
              addsensors.push(thesensor);
              console.log('please input another sensor or input exit to leave');
            }else{
              if(channeltype === '1' && inputtype === '5') {

                addsensors.push(thesensor);
                
                var db = new sqlite3.Database('aboutchannel');
                var updatesentence = "UPDATE channels SET sensorarray = '" + JSON.stringify(addsensors) + "' WHERE channelname = '" + channelname + "'";
                db.all(updatesentence, function(err,res) {
                  if(!err){
                    console.log('add sensor success');
                  }else{
                    console.log(err);
                  }
                });
                db.close();
                readsensor.close();
                console.log('This type of channel can only have one sensor');
              }else {
                console.log('This type of channel can not have the type of sensor');
              }
            }
            //addsensors.push(thesensor);
            break;
          }else{
            if(i === sen_idtypeduty.length - 1) {
              console.log('The message of the sensor you want to add is error, please input again or input exit to leave');
            }else{
              //console.log('no');
              continue;
            }
          }
        }

      }
    });

  }).catch((err) => {
    console.log(err);
  });

}
