exports.inisave=function(){
  var sqlite3=require('sqlite3').verbose();
  var db=new sqlite3.Database('devsensor');
  db.serialize(function(){
    db.run("CREATE TABLE IF NOT EXISTS devs (devid text, devname text, description text, registertime text)");
    db.run("CREATE TABLE IF NOT EXISTS sensors (sensorid text, devid text, sensorname text, description text, measure text, measurecharacter text, registertime text)");
  });
  db.close();
}
