
var async = require('async');
var readline = require('readline');
var rp = require('request-promise');

var addchannel = require('./addchannel');
var updatechannel = require('./updatechannel');
var deletechannel = require('./deletechannel');
var lookChannel = require('./lookchannel');
lookchannel = new lookChannel();
var searchchannel = require('./searchchannel');

var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('aboutchannel');
db.run( 'CREATE TABLE IF NOT EXISTS channels(channelname TEXT NOT NULL PRIMARY KEY, channeltype INTEGER NOT NULL, deviceid INTEGER, devicename TEXT, sensorarray TEXT)' );
db.close();

function getuserkey() {
  var readlogin = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  console.log('please input your username and password as username.password, or input exit to leave');
  readlogin.on('line', (input) => {
    switch (input)
    {
      case 'exit':
        readlogin.close();
        break;
      default:
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
            initialoperation(userkey);
          }
        }).catch((res) => {
          console.log(res);
        });
        break;
    }
  });
}

function initialoperation(userkey){

  var readinitial = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('Do you want to configure channel: 1.yes, 2.leave');

  readinitial.on('line', (answer) => {
    switch (answer)
    {
      case '1':
        readinitial.close();
        selectoperation(userkey);
        break;
      case '2':
        readinitial.close();
        break;
      default:
        console.log('error input,please input 1 or 2');
        break;
    }
  });
}

//function checkuser(){

//}

function selectoperation(userkey) {

  var readoperation = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('please select what you want to do next: 1.add channel, 2.update channel, 3.delete channel, 4.look channel, 5.look all channels, 6.leave');  

  readoperation.on('line', (answer) => {
    switch (answer)
    {
      case '1':
        readoperation.close();
        addchannel.addChannel(userkey);
        break;
      case '2':
        readoperation.close();
        updatechannel.updateChannel(userkey);
        break;
      case '3':
        readoperation.close();
        deletechannel.deleteChannel();
        break;
      case '4':
        readoperation.close();
        searchchannel.searchChannel();
        break;
      case '5':
        readoperation.close();
        lookchannel.allMessage(function(result){
          if(result.length === 0) {
            console.log('There is no channel');
          }else{
            for(var one of result) {
              console.log(JSON.stringify(one));
            }
          }
        });
        //lookchannel.allMessage();
        break;
      case '6':
        readoperation.close();
        break;
      default:
        console.log('error input, please input 1 or 2 or 3 or 4 or 5 or 6');
        break;
    }
  });
 
}

//initialoperation();
getuserkey();

