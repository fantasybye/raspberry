"use strict";

var Cylon = require('cylon');
var datapost=require('./dataPost');

Cylon.robot({

  //name:'raspberry',

  connections: {
    server: { adaptor: 'mqtt', host:"mqtt://localhost:1883" }
  },

  work: function(my){

    my.server.subscribe('/cylon/sensor/data');

    //savedata.inisave();
    //register=new Register();
     
    my.server.on('message',function(topic,data){

      console.log(topic+":"+data);
      
      //if(topic=="/cylon/sensor/data"){
        var sensordata=eval('('+data+')');
        for(var monitordata of sensordata){
          var monitordata=JSON.stringify(monitordata);
          var sensorname=monitordata.split(":")[0].replace(/\s+/g,"");
          var detaildata=monitordata.split(":")[1].replace(/\s+/g,"");
          var datalength=detaildata.length;
          detaildata=detaildata.substring(1,datalength-2);
          var devid=sensorname.split(".")[0].substring(2);
          var sensorid=sensorname.split(".")[1];
          var senidlength=sensorid.length;
          sensorid=sensorid.substring(0,senidlength-1);
          datapost.dataPost(devid,sensorid,detaildata);
          console.log(devid);
          console.log(sensorid);
          console.log(detaildata);

	  var listeners = listenerList[sensorId];
	  if (listener) {
	    for (var listener of listeners) {
	      listener(detaildata);
	    }
	  }
        }
      //}
    });
  }
}).start();

var listenerList = {};

exports.listenSensor = function(deviceId, sensorId, callback) {
	var deviceListener = listenerList[deviceId];
	var listeners = deviceId[sensorId];
	if (listeners === undefined) {
		listeners = [];
		listenerList[sensorId] = listeners;
	}

	listeners.push(callback);
}


var lights = core.getAllDeivces({type:'light'});
var switchers = core.getAllDeivces({type:'switcher'});
var switcher = switchers[0];
core.listen(switcher, function(status) {
  for (var light of lights) {
    core.sendCommend(light, status);
  }
});

