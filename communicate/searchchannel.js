
var sqlite3 = require('sqlite3').verbose();
var readline = require('readline');

exports.searchChannel = function() {
//function searchChannel() {
  
  selectDetail();
  
  function selectDetail() {
    var readselect = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    readselect.question('Which condition you want to search by: 1.name of channel, 2.id of device, 3.type of channel, or other keys to leave:\n', (answer) => {
      switch (answer)
      {
        case '1':
          readselect.close();
          searchByChannelName();
          break;
        case '2':
          readselect.close();
          searchByDeviceId();
          break;
        case '3':
          readselect.close();
          searchByChannelType();
          break;
        default:
          readselect.close();
          break;
      }
    });
  }

  function searchByChannelName() {
    var readname = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    var db = new sqlite3.Database('aboutchannel');
    console.log('please input the name of the channel you want to search, or input exit to leave');
    readname.on('line', (input) => {
      if(input === 'exit') {
        db.close();
        readname.close();
        //selectDetail();
      }else{
        //console.log(input+'x');
        var selectsentence = "SELECT * FROM channels WHERE channelname = '" + input + "'";
        console.log(selectsentence);
        db.all(selectsentence, function(err, res) {
          if(!err) {
            //console.log(res);
            if(res.length === 0) {
              console.log('There is no channel named ' + input + ', input another name or input exit to leave');
            }else{
              console.log(res);
            }
          }else{
            console.log(err);
          }
        });
      }
    });
  }

  function searchByDeviceId() {
    var readdeviceid = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    var db = new sqlite3.Database('aboutchannel');
    console.log('please input the id of the device that the channel you want to search belongs to, or input exit to leave');
    readdeviceid.on('line', (input) => {
      if(input === 'exit') {
        db.close();
        readdeviceid.close();
        //selectDetail();
      }else{
        var deviceid = Number(input);
        var selectsentence = "SELECT * FROM channels WHERE deviceid = '" + deviceid + "'";
        db.all(selectsentence, function(err, res) {
          if(!err) {
            //callback(res);
            //console.log(res);
            if(res.length === 0) {
              console.log('There is no channel belongs to the device, input another device or input exit to leave');
            }else{
              for(var one of res) {
                console.log(JSON.stringify(one));
              }
            }
          }else{
            console.log(err);
          }
        });
      }
      
    });
  }
  
  function searchByChannelType() {
    var readtype = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    var db = new sqlite3.Database('aboutchannel');
    console.log('please input the type value or direction of the channel you want to search, or input exit to leave');
    readtype.on('line', (input) => {
      switch (input)
      {
        case 'exit':
          db.close();
          readtype.close();
          //selectDetail();
          break;
        case 'value':
          var type = 0;
          var selectsentence = "SELECT * FROM channels WHERE channeltype = '" + type + "'";
          db.all(selectsentence, function(err, res) {
            if(!err) {
              if(res.length === 0) {
                console.log('There is no channel of this type');
              }else{
                for(var one of res) {
                  console.log(JSON.stringify(one));
                }
              }
            }else{
              console.log(err);
            }
          });
          break;
        case 'direction':
          var type = 1;
          var selectsentence = "SELECT * FROM channels WHERE channeltype = '" + type + "'";
          db.all(selectsentence, function(err, res) {
            if(!err) {
              if(res.length === 0) {
                console.log('There is no channel of this type');
              }else{
                for(var one of res) {
                  console.log(JSON.stringify(one));
                }
              }
            }else{
              console.log(err);
            }
          });
          break;
        default:
          console.log('error type, please input again or leave');
          break;
      }
    });
  }
  
}

//module.exports = searchChannel;
