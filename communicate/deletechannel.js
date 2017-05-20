
var readline = require('readline');
var sqlite3 = require('sqlite3').verbose();

//var conornot = require('./configurechannel');
var lookChannel = require('./lookchannel');
lookchannel = new lookChannel();

exports.deleteChannel = function() {

  //process.stdout.write('delete channel\n');
  console.log('delete channel');

  selectDetail();

  function selectDetail() {
    var readselect = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    console.log('What do you use to delete: 1.name of channel, 2.id of device channel belongs to, 3.leave');
    readselect.on('line', (input) => {
      switch (input)
      {
        case '1':
          readselect.close();
          deleteByName();
          break;
        case '2':
          readselect.close();
          deleteByDeviceId();
          break;
        case '3':
          readselect.close();
          break;
        default:
          console.log('please input again, 1 or 2 or 3');
          break;
      }
    });
  }

  function deleteByName() {
    console.log('delete by name');
    lookchannel.allName(function(result) {
      console.log('get all names');
      if(result.length === 0) {
        console.log('There is no channel in database');
        //process.close();
      }else {
        var deletename = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        var db = new sqlite3.Database('aboutchannel');
        console.log('please input the name of the channel you want to delete, or input exit to leave');
        deletename.on('line', (input) => {
          if(input === 'exit') {
            db.close();
            deletename.close();
            //leave or configure continously
            //conornot.continueoperation();
          }else{
            for(var i = 0; i < result.length; i++) {
              if(input === result[i].channelname) {
                var deletesentence = "DELETE FROM channels WHERE channelname = '" + input + "'";
                deletename.close();
                db.all(deletesentence, function(err, res) {
                  if(!err){
                    console.log('delete success');
                  }else {
                    console.log(err);
                  }
                });
                break;
              }else{
                if(i === result.length - 1) {
                  console.log('The channel is not saved');
                }else{
                  continue;
                }
              }
            }
          }
        
        });
      }

    });
  }
  
  function deleteByDeviceId() {
    var deleteid = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    var db = new sqlite3.Database('aboutchannel');
    console.log('please input the id of the device the channel belongs to, or input exit to leave');
    deleteid.on('line', (input) => {
      if(input === 'exit') {
        db.close();
        deleteid.close();
        //leave or configure continously
        //conornot.continueoperation();
      }else{
        var deviceid = Number(input);
        var selectsentence = "SELECT * FROM channels WHERE deviceid = '" + deviceid + "'";
        db.all(selectsentence, function(err, res) {
          if(!err) {
            if(res.length === 0) {
              console.log('There is no channel belongs to the device, input another device or input exit to leave');
            }else {
              var deletesentence = "DELETE FROM channels WHERE deviceid = '" + deviceid + "'";
              deleteid.close();
              db.all(deletesentence, function(err, res) {
                if(!err) {
                  console.log('delete success');
                  //console.log('please input the id of the device the channel belongs to, or input exit to leave');
                }else {
                  console.log(err);
                }
              });
            }
          }else {
            console.log(err);
          }
        });
      }
    });
  }

}
