var mysql = require("mysql");

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "hotel_reservation_system",
  port: 3307
});
con.connect(function(err){
  if(err){
    console.log('Error connecting to DB');
    console.log(err);
    return;
  }
});

exports.con = con;
