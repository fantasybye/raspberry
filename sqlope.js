function sqlope(){
  var sqlite3=require('sqlite3').verbose();
  //var db=new sqlite3.Database('devsensor');
  this.savedev=function(devid,devname,description,registertime){
    var db=new sqlite3.Database('devsensor');
    var stmt=db.prepare("INSERT INTO devs VALUES(?,?,?,?)");
    stmt.run(devid,devname,description,registertime);
    stmt.finalize();
    //db.run("INSERT INTO devs values("+devid+","+devname+","+description+")");
    //db.finalize();
    db.close();
  };
  this.savesensor=function(sensorid,devid,sensorname,description,measure,measurecharacter,registertime){
    var db=new sqlite3.Database('devsensor');
    var stmt=db.prepare("INSERT INTO sensors VALUES(?,?,?,?,?,?,?)");
    stmt.run(sensorid,devid,sensorname,description,measure,measurecharacter,registertime);
    stmt.finalize();
    //db.run("INSERT INTO sensors values("+sensorid+","+devid+","+sensorname+","+description+","+measure+","+measurecharacter+")");
    //db.finalize();
    db.close();
  };
  this.selectdevid=function(devname,registertime){
    var db=new sqlite3.Database('devsensor');
    var stmt=db.prepare("SELECT devid FROM devs WHERE devname=? and registertime=?");
    var id=stmt.run(devname,registertime);
    stmt.finalize();
    return id;
  };
  this.selectsensorid=function(devid,sensorname,registertime){
    var db=new sqlite3.Database('devsensor');
    var stmt=db.prepare("SELECT sensorid FROM sensors WHERE devid=? and sensorname=? and registertime=?");
    var id=stmt.run(devid,sensorname,registertime);
    stmt.finalize();
    return id;
  };
}
module.exports=sqlope;
