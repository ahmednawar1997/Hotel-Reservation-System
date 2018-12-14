
function getRoomsByHotelId(req){
    var sql = "SELECT * FROM room_type where hotel_id = ?";
    return new Promise((resolve, reject) => {
      req.con.query(sql, [req.params.hotel_id], function (err, rooms) {
        if (err) console.log(err);
        resolve(rooms);
      });
    });

}

function insertReservation(req){

}



















module.exports = {
    insertReservation,
    getRoomsByHotelId
  };