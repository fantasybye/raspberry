
var readline = require('readline');
var rp = require('request-promise');

var userregister = require('./userregister');
var deviceregister = require('./deviceregister');
var sensorregister = require('./sensorregister');
var sensordelete = require('./sensordelete');
var devicedelete = require('./devicedelete');

var readchoice = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
readchoice.question('What do you want to do: 1.register user, 2.register or delete device or sensor, or input exit to leave\n', (answer) => {
  switch (answer)
  {
    case '1':
      readchoice.close();
      userregister.userRegister();
      break;
    case '2':
      readchoice.close();
      login();
      break;
    case 'exit':
      readchoice.close();
      break;
    default:
      readchoice.close();
      break;
  }
});

function login() {
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
          //console.log(response);
          var userkey = response.api_key;
          if(userkey === undefined) {
            console.log('error username or password, input again or input exit to leave');
          }else {
            readlogin.close();
            deviceorsensor(userkey);
          }
        }).catch((res) => {
          //console.log(res);
        });
        break;
    }
  });
}

function deviceorsensor(key) {
  
  var readdors = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  readdors.question('please select: 1.register device, 2.register sensor, 3.delete device from all, 4.delete sensor from all, or exit to leave\n', (answer) => {
    switch (answer)
    {
      case '1':
        readdors.close();
        deviceregister.deviceRegister(key);
        break;
      case '2':
        readdors.close();
        sensorregister.sensorRegister(key);
        break;
      case '3':
        readdors.close();
        devicedelete.deviceDelete(key);
        break;
      case '4':
        readdors.close();
        //sensordelete.sensorDelete(key);
        sensordevice(key);
        break;
      case 'exit':
        readdors.close();
        break;
      default:
        readdors.close();
        break;
    }
  });
  
}

function sensordevice(key) {
  var readsendev = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  readsendev.question('please input the id of the device which the sensor you want to delete belongs to, or input exit to leave\n', (answer) => {
    switch (answer)
    {
      case 'exit':
        readsendev.close();
        break;
      default:
        readsendev.close();
        sensordelete.sensorDelete(Number(answer), key);
        break;
    }
  });
}
