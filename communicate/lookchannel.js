
var readline = require('readline');

function lookChannel() {

  var sqlite3 = require('sqlite3').verbose();

  this.allName = function(callback) {
    console.log('get saved channels');
    var getallname = "SELECT channelname FROM channels";
    var db = new sqlite3.Database('aboutchannel', function() {
      db.all(getallname, function(err, res) {
        if(!err) {
          callback(res);
        }else {
          console.log(err);
        }
      });
    });
    db.close();
  }
  
  this.allMessage = function(callback) {
    var getallmessage = "SELECT * FROM channels";
    var db = new sqlite3.Database('aboutchannel', function() {
      db.all(getallmessage, function(err, res) {
        if(!err){
          //callback(res);
          //console.log(JSON.stringify(res));
          console.log('get all channel');
          callback(res);
          //if(res.length === 0) {
            //console.log('there is no channel');
          //}else{
            //for(var channel of res) {
              //console.log(JSON.stringify(channel));
            //}
          //}
        }
      });
    });
    db.close();
  }

  this.searchChannel = function() {

    var readname = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    readname.question('What is the name of the channel to search:', (answer) => {
      readname.close();
      var getchannel = "SELECT * FROM channels WHERE channelname = '" + answer + "'";
      var db = new sqlite3.Database('aboutchannel', function() {
        db.all(getchannel, function(err, res) {
          if(!err) {
            console.log(JSON.stringify(res));
          }else{
            console.log(err);
          }
        });
      });
      db.close();
    });
  }

}

module.exports = lookChannel;
