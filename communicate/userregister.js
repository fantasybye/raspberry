
var rp = require('request-promise');
var readline = require('readline');

exports.userRegister = function() {

function setusername() {
  var readusername = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  readusername.question('please set username:\n', (answer) => {
    readusername.close();
    setpassword(answer);
  });
}

function setpassword(username) {
  var readpassword = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  console.log('set the password:');
  var i = 0;
  var passwords = new Array();
  readpassword.on('line', (input) => {
    passwords.push(input);
    i++;
    if(i === 1) {
      console.log('please input the password again.');
    }
    if(i === 2) {
      if(passwords[0] === passwords[1]) {
        readpassword.close();
        register(username, input);
      }else {
        console.log('Two passwords are not same, please input again');
        i = 0;
        passwords.splice(0,2);
      }         
    }
  });
}

function register(username, password) {
  var options = {
    method: 'POST',
    url: `http://localhost:3000/register`,
    body: {
      username: username,
      password: password,
    },
    headers: {
      'Content-Type': 'application/json',
    },
    json: true
  };
  rp(options).then((response) => {
    console.log(response.api_key);
  }).catch((err) => {
    console.log(err);
  });
}

setusername();

}
