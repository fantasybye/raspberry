
var Cylon = require('cylon');

Cylon.robot({

  connections: {
    clientpub: {adaptor:'mqtt', host:'mqtt://localhost:1883'}
  },
  
  work: function(my) {
    my.clientpub.subscribe('pubchanneltoday');
    my.clientpub.subscribe('pubchannelten');

    my.clientpub.on('message', function(topic, data) {
      console.log(topic+":"+data);
    });
  }

}).start();
