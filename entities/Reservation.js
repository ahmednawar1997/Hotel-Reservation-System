var date = require('date-and-time');



function insertReservation(req){
  var query = "INSERT INTO  reservations (hotel_id, customer_id, check_in_date, check_out_date, reservation_date) VALUES (?,?,?,?,?)";
  return new Promise((resolve, reject) => {
    var now = new Date();
    date.format(now, '[YYYY-MM-DD]');    
    req.con.query(query, [req.params.hotel_id, req.user.id, req.body.checkin, req.body.checkout, now],
      (err, insertedReservation) => {
        if (err) throw err;
        console.log("inserted res");

        resolve(insertedReservation.insertId);
      });

  });

}




function insertReservedRoomsInReservation(req, reservation_id, index){
  console.log("reserved rooms");
  var query = "INSERT INTO  reserved_rooms (reservation_id, room_type, number_of_rooms) VALUES (?,?,?)";
  return new Promise((resolve, reject) => {
    req.con.query(query, [reservation_id, req.body.room_types[index], req.body.numberOfRooms[index]],
      (err, insertedReservedRoom) => {
        if (err) throw err;
        resolve();
      });

  });

}



















module.exports = {
    insertReservation,
    insertReservedRoomsInReservation
  };