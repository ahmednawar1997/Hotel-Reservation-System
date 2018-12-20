
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
    console.log(req.user);
    req.con.query(query, [req.body.roomType, req.params.hotel_id, req.body.view, req.body.price, req.body.quantity],
      (err) => {
        if (err) throw err;
        resolve();
      });

  });
}


function getAvailableRoomsIfReserved(req, hotel_id, checkin, checkout){
  var query = "SELECT DISTINCT reservations.check_in_date , reservations.check_out_date , room_type.* , SUM(reserved_rooms.number_of_rooms) AS 'total_number_reserved ', (room_type.number_of_rooms-SUM(reserved_rooms.number_of_rooms)) AS 'available_rooms' "+
  "FROM reservations " +
  "INNER JOIN reserved_rooms " +
  "ON reservations.reservation_id = reserved_rooms.reservation_id " +
  "INNER JOIN room_type " +
  "ON reservations.hotel_id = room_type.hotel_id AND reserved_rooms.room_type = room_type.room_type " +             
  "WHERE ? > reservations.check_in_date AND ? < reservations.check_out_date AND reservations.hotel_id = ? " +
  "OR " +
  "? > reservations.check_in_date AND ? < reservations.check_out_date AND reservations.hotel_id = ? " +
  "OR ? < reservations.check_in_date AND ? > reservations.check_out_date AND reservations.hotel_id = ? " +	
  "GROUP BY room_type.room_type";
  return new Promise((resolve, reject) => {
    req.con.query(query, [checkin, checkin, hotel_id, checkout, checkout, hotel_id, checkin, checkout, hotel_id ],
      (err, availableRooms) => {
        if (err) throw err;
        console.log("AVAILABLE ROOMS");
        console.log(availableRooms);
        console.log(availableRooms.length);
        resolve(availableRooms);
      });

  });
}





module.exports = {
    getRoomsByHotelId,
    insertRoom,
    getAvailableRoomsIfReserved
  };