"use strict";

var Cylon=require('cylon');

Cylon.robot({
  connections:{
    client: {adaptor:'mqtt', host:'mqtt://localhost:1883'}
  },
  work:function(my){
    var mess=[{dname:'arduinoadd',info:'testconnection'},
              {dname:'sensorro',info:'testsensor',unit:'o',symbol:''},
              {dname:'sensorsx',info:'testsensor',unit:'e',symbol:'m'}];
    var mo=[{"1.1":"23.123"},
            {"1.5":"19.02"}];
    //console.log("test:"+JSON.stringify(mo));
    my.client.publish('/cylon/sensor/data',JSON.stringify(mo));
    my.client.subscribe('ensureid');
    my.client.on('message',function(topic,data){
      if(topic=='ensureid'){
        console.log(topic+":"+data);
      }
    });
  }
}).start();
