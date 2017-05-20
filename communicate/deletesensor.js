
var sqlite3 = require('sqlite3').verbose();
var readline = require('readline');

exports.deleteSensor = function(channelname, deviceid) {

  console.log('delete sensor from ' + channelname);

  var getsensorofchannel = function(callback) {
    console.log('get all sensors of it from database');
    var db = new sqlite3.Database('aboutchannel');
    var selectsentence = "SELECT sensorarray FROM channels WHERE channelname = '" + channelname + "'";
    db.all(selectsentence, function(err, res) {
      if(!err) {
        //console.log(res);
        callback(res);
      }else {
        console.log(err);
      }
    });
    db.close();
  }

  getsensorofchannel(function(result) {
    
    var existsensors = eval('('+ result[0].sensorarray +')');
    //console.log(JSON.stringify(existsensors));
    //console.log(existsensors.length);
    var readsensor = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    var db = new sqlite3.Database('aboutchannel');
    console.log('please input the id, duty and type of the sensor as id.duty.type, or input exit to leave');
    readsensor.on('line', (input) => {
      if(input === 'exit') {
        db.close();
        readsensor.close();
      }else{
        var deleteid = input.split(".")[0].replace(/\s+/g,"");
        var deleteduty = input.split(".")[1].replace(/\s+/g,"");
        var deletetype = input.split(".")[2].replace(/\s+/g,"");
        for(var i = 0; i < existsensors.length; i++) {
          if((deleteid === existsensors[i].id) && (deleteduty === existsensors[i].duty) && (deletetype === existsensors[i].type)) {
            console.log('prepare to delete the sensor');
            existsensors.splice(i,1);
            console.log('save the array that has been modified to database');
            var updatesentence = "UPDATE channels SET sensorarray = '" + JSON.stringify(existsensors) + "' WHERE channelname = '" + channelname + "'";
            db.all(updatesentence, function(err, res) {
              if(!err) {
                console.log('delete success');
                //console.log(res);
                if(existsensors.length === 0) {
                  console.log('There is no sensor in the channel');
                  readsensor.close();
                }
              }else {
                console.log(err);
              }
            });
            break;
          }else{
            if(i === existsensors.length - 1) {
              console.log('The sensor does not belong to the channel');
            }else{
              continue;
            }
          }
        }
      }


    });
  });
  

}
