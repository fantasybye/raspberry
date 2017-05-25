var Cylon = require('cylon');

Cylon.robot({
  connections: {
    client: {adaptor:'mqtt', host: 'mqtt://localhost:1883'}
  },
  work: function(my) {
    //var m1 = [{"1":"26.3","2":"test"}];
    var m1 = [{"1":"26.3"}];
    var m2 = [{"6":"1.3"}];
    var m3 = [{"7":"testt"}];
    every((3).seconds(), function() {
      my.client.publish('subchanneltoday',JSON.stringify(m1));
      console.log('published');
    });
    //every((1).seconds(), function() {
      //my.client.publish('subchannelfive',JSON.stringify(m2));
    //});
    //every((5).seconds(), function() {
      //my.client.publish('subchannelsix', JSON.stringify(m3));
    //});
  }
}).start();
