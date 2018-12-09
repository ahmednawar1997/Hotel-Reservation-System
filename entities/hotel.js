function insertHotel(req) {
  var query =
    "INSERT INTO  hotels (name, location, owner_id, stars, description) VALUES (?,?,?,?,?)";

  return new Promise((resolve, reject) => {
    console.log(req.user);
    req.con.query(
      query,
      [
        req.body.hotelname,
        req.body.location,
        req.user.id,
        req.body.stars,
        req.body.description
      ],
      (err, rows) => {
        console.log(req.user);
        if (err) throw err;
        resolve();
      }
    );
  });
}

function getAllApprovedHotels(req) {
  var sql = "SELECT * FROM hotels where approved = ?";
  return new Promise((resolve, reject) => {
    req.con.query(sql, [1], function(err, hotels) {
      if (err) console.log(err);
      resolve(hotels);
    });
  });
}

function getAllApprovedHotelsWithFacilities(req) {
  var sql =
    "SELECT * FROM hotels, facilities where approved = ? AND hotels.id = facilities.hotel_id;";
  return new Promise((resolve, reject) => {
    req.con.query(sql, [1], function(err, hotels) {
      if (err) console.log(err);
      resolve(hotels);
    });
  });
}

module.exports = {
  insertHotel: insertHotel,
  getAllApprovedHotels: getAllApprovedHotels,
  getAllApprovedHotelsWithFacilities: getAllApprovedHotelsWithFacilities
};
