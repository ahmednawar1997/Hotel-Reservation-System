var mysql = require("mysql");

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "hotel_reservation_system",
  port: 3306
});
con.connect(function (err) {
  if (err) {
    console.log("Error connecting to DB");
    console.log(err);
    return;
  }
});

exports.con = con;
