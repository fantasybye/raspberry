function sqlope(){
  var sqlite3=require('sqlite3').verbose();
  this.savedev=function(devid,devname,description,registertime){
    var db=new sqlite3.Database('devsensor');
    var stmt=db.prepare("INSERT INTO devs VALUES(?,?,?,?)");
    stmt.run(devid,devname,description,registertime);
    stmt.finalize();
    db.close();
  };
  this.savesensor=function(sensorid,devid,sensorname,description,measure,measurecharacter,registertime){
    var db=new sqlite3.Database('devsensor');
    var stmt=db.prepare("INSERT INTO sensors VALUES(?,?,?,?,?,?,?)");
    stmt.run(sensorid,devid,sensorname,description,measure,measurecharacter,registertime);
    stmt.finalize();
    db.close();
  };
}
module.exports=sqlope;
