function insertHotel(req) {
  var query1 =
    "INSERT INTO  hotels (name, location, owner_id, stars, description) VALUES (?,?,?,?,?)";
  var query2 =
    "INSERT INTO  facilities (hotel_id, pool, restaurant, bar, gym, kids_area, spa) VALUES (?,?,?,?,?,?,?)";
  var query3 = "SELECT id FROM hotels WHERE owner_id=? AND name=?";
  facilities = {
    pool: req.body.pool ? 1 : 0,
    restaurant: req.body.restaurant ? 1 : 0,
    bar: req.body.bar ? 1 : 0,
    gym: req.body.gym ? 1 : 0,
    kidsArea: req.body.kidsArea ? 1 : 0,
    spa: req.body.spa ? 1 : 0
  };

  return new Promise((resolve, reject) => {
    console.log(req.user);
    req.con.query(
      query1,
      [
        req.body.hotelname,
        req.body.location,
        req.user.id,
        req.body.stars,
        req.body.description
      ],
      (err, rows) => {
        if (err) throw err;
        req.con.query(
          query3,
          [req.user.id, req.body.hotelname],
          (err, rows) => {
            if (err) throw err;
            var hotelId = rows[0].id;
            req.con.query(
              query2,
              [
                hotelId,
                facilities.pool,
                facilities.restaurant,
                facilities.bar,
                facilities.gym,
                facilities.kidsArea,
                facilities.spa
              ],
              err => {
                if (err) throw err;
                resolve();
              }
            );
          }
        );
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
