
var sqlite3 = require('sqlite3').verbose();
var readline = require('readline');

var lookChannel = require('./lookchannel');
lookchannel = new lookChannel();
var addsensor = require('./addsensor');
var deletesensor = require('./deletesensor');

exports.updateChannel = function(key) {

  console.log('update channel');
  
  selectChannel();

  function selectChannel() {
    var allchannels = new Array();
    lookchannel.allMessage(function(result) {
      if(result.length === 0) {
        console.log('There is no channel');
        //process.close();
      }
      
      for(var one of result) {
        var name = one.channelname;
        var deviceid = one.deviceid;
        var type = one.channeltype;
        //allchannels.push(`{channelname:${name},deviceid:${deviceid}}`);
        allchannels.push({channelname:`${name}`,deviceid:`${deviceid}`,channeltype:`${type}`});
      }

      //console.log(allchannels);

      var readchannel = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      console.log('Which channel do you want to update, please input the name and the device of it as channelname.deviceid, or input exit to leave');
      readchannel.on('line', (input) => {
        if(input === 'exit') {
          readchannel.close();
        }else{
          //var inputname = input.split(".")[0].replace(/\s+/g,"");
          //console.log(inputname);
          //var inputid = input.split(".")[1].replace(/\s+/g,"");
          var inputname = input.split(".")[0];
          //console.log(inputname);
          var inputid = input.split(".")[1];
          console.log(inputid);
          for(var i = 0; i < allchannels.length; i++) {
            var one = allchannels[i];
            //if(inputid === one.deviceid) {
              //console.log('yes');
            //}else{
              //console.log('no');
            //}
            if((inputname === one.channelname) && (inputid === one.deviceid)) {
              readchannel.close();
              selectUpdate(inputname, inputid, one.channeltype);
              break;
            }else{
              if(i === allchannels.length - 1) {
                //console.log(one.deviceid);
                console.log('The message of the channel you want to update is error please input again, or input exit to leave');        
              }else{
                continue;
              }
            }
          }
        }
      });
    });
  }

  function selectUpdate(channelname, deviceid, channeltype) {
    console.log(`update ${channelname}`);
    var readselect = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    console.log('What do you want to update: 1.name of the channel, 2.add sensors to the channel, 3.delete sensors from the channel, any other key to leave');
    readselect.on('line', (input) => {
      switch (input)
      {
        case '1':
          readselect.close();
          changechannelname(channelname);
          break;
        case '2':
          readselect.close();
          addsensortochannel(channelname, deviceid, channeltype, key);
          break;
        case '3':
          readselect.close();
          deletesensorfromchannel(channelname, deviceid);
          break;
        default:
          readselect.close();
          break;
      }
    });
  }

  function changechannelname(channelname){
    console.log(`change name of ${channelname}`);
    var readnewname = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    lookchannel.allName(function(result) {
      console.log('please input the new name, or input exit to leave');
      readnewname.on('line', (input) => {
        if(input === 'exit') {
          readnewname.close();
        }else{
          for(var i = 0; i < result.length; i++) {
            if(input === result[i].channelname) {
              console.log('the name has been used by other channels, please input another, or input exit to leave');
              break;
            }else{
              if(i === result.length - 1) {
                readnewname.close();
                var db = new sqlite3.Database('aboutchannel');
                var updatesentence = "UPDATE channels SET channelname = '" + input + "' WHERE channelname = '" + channelname + "'";
                db.all(updatesentence, function(err, res) {
                  if(!err) {
                    console.log('update name success');
                  }else{
                   console.log(err);
                  }
                });
              }else{
                continue;
              }
            }
          }
        }
        
      });
    });
  }

  function addsensortochannel(channelname, deviceid, channeltype, key){
    switch (channeltype)
    {
      case '1':
        var db = new sqlite3.Database('aboutchannel');
        var check = "SELECT sensorarray FROM channels WHERE channelname = '" + channelname + "'";
        db.all(check, function(err, res) {
          if(!err) {
            //console.log(res[0].sensorarray);
            if(res[0].sensorarray === null) {
              addsensor.addSensor(channelname, deviceid, channeltype, key);
            }else {
              console.log('This type of channel can only have one sensor');
            }
          }else {
            console.log(err);
          }
        });
        db.close()
        break;
      default:
        addsensor.addSensor(channelname, deviceid, channeltype, key);
        break;
    }
    
  }

  function deletesensorfromchannel(channelname, deviceid){
    var db = new sqlite3.Database('aboutchannel');
    var check = "SELECT sensorarray FROM channels WHERE channelname = '" + channelname + "'";
    db.all(check, function(err, res) {
      if(!err) {
        if(res[0].sensorarray === null){
          console.log('There is no sensor in the channel');
        }else {
          deletesensor.deleteSensor(channelname, deviceid);
        }
      }else {
        console.log(err);
      }
    });
    
  }

}
