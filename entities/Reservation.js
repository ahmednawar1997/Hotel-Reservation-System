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
function getAllOwnerReservations(req) {
  var query = "SELECT hotels.name as hotel_name, reservations.* " +
      "FROM reservations, hotels, users " +
      "WHERE hotels.owner_id = ? AND " +
      "reservations.hotel_id = hotels.id " +
      "AND users.id = reservations.customer_id";
  return new Promise((resolve, reject) => {
      req.con.query(query, [req.user.id], (err, reservations) => {
          if (err) console.log(err);
          resolve(reservations);
      });
  });
}

function getAllOwnerReservationsWithRoomsDetails(req) {
  var query = "SELECT hotels.name as hotel_name, reservations.*, users.*, reserved_rooms.* " +
      "FROM reservations, hotels, users, reserved_rooms " +
      "WHERE hotels.owner_id=? " +
      "AND reservations.hotel_id=hotels.id " +
      "AND users.id=reservations.customer_id " +
      "AND reserved_rooms.reservation_id=reservations.reservation_id";
  return new Promise((resolve, reject) => {
      req.con.query(query, [req.user.id], (err, detailedReservations) => {
          if (err) console.log(err);
          console.log("TESTTT", detailedReservations);
          resolve(detailedReservations);
      });
  });
}


function cancelReservationFromCustomer(req, reservation_id) {
  var query = "UPDATE reservations SET customer_approval = ? WHERE reservation_id = ?;";
  return new Promise((resolve, reject) => {
      req.con.query(query, [0, reservation_id], (err, updatedReservation) => {
          if (err) console.log(err);
          resolve(updatedReservation);
      });
  });
}






module.exports = {
    insertReservation,
    insertReservedRoomsInReservation,
    getAllOwnerReservations,
    getAllOwnerReservationsWithRoomsDetails,
    cancelReservationFromCustomer
  };