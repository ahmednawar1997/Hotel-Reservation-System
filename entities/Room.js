
function getRoomsByHotelId(req){
    var sql = "SELECT * FROM room_type where hotel_id = ?";
    return new Promise((resolve, reject) => {
      req.con.query(sql, [req.params.hotel_id], function (err, rooms) {
        if (err) console.log(err);
        resolve(rooms);
      });
    });

}

function insertRoom(req) {
  var query = "INSERT INTO  room_type (room_type, hotel_id, room_view, price, number_of_rooms) VALUES (?,?,?,?,?)";
  return new Promise((resolve, reject) => {
    req.con.query(query, [req.body.roomType, req.params.hotel_id, req.body.view, req.body.price, req.body.quantity],
      (err) => {
        if (err) throw err;
        resolve();
      });

  });
}


function getNumberOfRooms(req, hotel_id, checkin, checkout){
  var query = "SELECT total_number_of_rooms.room_type,total_number_of_rooms.room_view,total_number_of_rooms.price,sum1-IFNULL(sum2, 0) AS free_rooms FROM "+
  "(SELECT room_type.room_type,room_type.room_view,room_type.price,SUM(room_type.number_of_rooms) AS sum1 "+
  "FROM room_type "+
  "WHERE room_type.hotel_id=? "  +
  "GROUP BY room_type.room_type,room_type.room_view,room_type.price)AS total_number_of_rooms "+
  "LEFT OUTER JOIN " +
  "(SELECT hotel_reservation_ids.room_type,SUM(hotel_reservation_ids.number_of_rooms) AS sum2 "+
  "FROM " +
  "(SELECT reserved_rooms.* FROM reserved_rooms " +
  "INNER JOIN "+
  "(SELECT reservations.reservation_id FROM reservations "+
  "WHERE reservations.hotel_id=? " +
   "AND " +
  "((? >= reservations.check_in_date AND ? < reservations.check_out_date) "+
  "OR (? <= reservations.check_in_date AND ? > reservations.check_in_date AND ? < reservations.check_out_date) "+
  "OR (? >= reservations.check_in_date AND ? < reservations.check_out_date)) "+
  ")AS input_conditions "+
  "ON "+
  "reserved_rooms.reservation_id=input_conditions.reservation_id)AS hotel_reservation_ids "+
   "GROUP BY hotel_reservation_ids.room_type) AS number_of_reserved_rooms "+
   "ON number_of_reserved_rooms.room_type=total_number_of_rooms.room_type;";

  return new Promise((resolve, reject) => {
    req.con.query(query, [hotel_id, hotel_id, checkin, checkin, checkin, checkout , checkin , checkin , checkout],
      (err, availableRooms) => {
        if (err) throw err;
        resolve(availableRooms);
      });

  });
}





module.exports = {
    getRoomsByHotelId,
    insertRoom,
    getNumberOfRooms
  };