
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
      });
    resolve();
  });
}





module.exports = {
    getRoomsByHotelId,
    insertRoom
  };