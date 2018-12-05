var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "lab4",
  port: 3307
});
con.connect(function(err){
  if(err){
    console.log('Error connecting to DB');
    console.log(err);
    return;
  }
  console.log('Connection to DB established');
});

exports.con = con;
