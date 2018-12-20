function insertHotel(req) {
  var query1 = "INSERT INTO  hotels (name, owner_id, stars, description) VALUES (?,?,?,?)";
  var query2 = "INSERT INTO  facilities (hotel_id, pool, restaurant, bar, gym, kids_area, spa) VALUES (?,?,?,?,?,?,?)";
  var query3 = "INSERT INTO  hotel_locations (hotel_id, country, city, district, street) VALUES (?,?,?,?,?)";
  facilities = {
    pool: req.body.pool ? 1 : 0,
    restaurant: req.body.restaurant ? 1 : 0,
    bar: req.body.bar ? 1 : 0,
    gym: req.body.gym ? 1 : 0,
    kidsArea: req.body.kidsArea ? 1 : 0,
    spa: req.body.spa ? 1 : 0
  };

  return new Promise((resolve, reject) => {
    req.con.query(query1, [req.body.hotelname, req.user.id, req.body.stars, req.body.description],
      (err, insertedHotel) => {
        if (err) throw err;

        req.con.query(query3, [insertedHotel.insertId, req.body.country, req.body.city, req.body.district, req.body.street],
          (err) => {
            if (err) throw err;

            req.con.query(query2, [insertedHotel.insertId, facilities.pool, facilities.restaurant, facilities.bar, facilities.gym, facilities.kidsArea, facilities.spa], (err) => {
              if (err) throw err;
              resolve();
            });
          });
      });
  });
}

function getAllOwnedHotels(req) {
  var sql = "SELECT * FROM hotels WHERE owner_id=?";
  return new Promise((resolve, reject) => {
    req.con.query(sql, [req.user.id], function (err, hotels) {
      if (err) console.log(err);
      resolve(hotels);
    });
  });
}

function getAllApprovedHotels(req) {
  var sql = "SELECT * FROM hotels INNER JOIN hotel_locations ON hotels.id = hotel_locations.hotel_id where approved = ?";
  return new Promise((resolve, reject) => {
    req.con.query(sql, [1], function (err, hotels) {
      if (err) console.log(err);
      resolve(hotels);
    });
  });
}
function getAllNonApprovedHotels(req) {
  var sql = "SELECT hotels.*, users.name as owner_name FROM hotels INNER JOIN users ON hotels.owner_id = users.id AND approved = ?";
  return new Promise((resolve, reject) => {
    req.con.query(sql, [0], function (err, hotels) {
      if (err) console.log(err);
      resolve(hotels);
    });
  });
}

function approveHotel(req) {
  var sql = "UPDATE hotels SET approved = ? WHERE id = ?;";
  return new Promise((resolve, reject) => {
    req.con.query(sql, [1, req.body.hotel_id], function (err, hotel) {
      if (err) console.log(err);
      resolve(hotel);
    });
  });
}

function getAllApprovedHotelsWithFacilities(req) {
  var sql = "SELECT * FROM hotels INNER JOIN facilities ON hotels.id = facilities.hotel_id AND hotels.approved = ? INNER JOIN hotel_locations ON hotels.id = hotel_locations.hotel_id";
  sql = addFacilitiesToQuery(req, sql);
  sql = addLocationToQuery(req, sql);
  console.log(sql);
  return new Promise((resolve, reject) => {
    req.con.query(sql, [1], function (err, hotels) {
      if (err) console.log(err);
      resolve(hotels);
    });
  });
}

function getHotelDetails(req) {
  var sql = "SELECT hotels.*, facilities.* " +
    "FROM hotels " +
    "INNER JOIN facilities " +
    "ON hotels.id = facilities.hotel_id " +
    "WHERE hotels.id = ?";
  return new Promise((resolve, reject) => {
    req.con.query(sql, [req.params.hotel_id], function (err, hotels) {
      if (err) console.log(err);
      console.log(hotels[0]);
      resolve(hotels[0]);
    });
  });
}

function getHotelDetailsAndRooms(req) {
  var sql = "SELECT * " +
    "FROM hotels, facilities, room_type, hotel_locations " +
    "WHERE hotels.id=? AND hotels.id=facilities.hotel_id " +
    "AND hotels.id=room_type.hotel_id AND hotels.id=hotel_locations.hotel_id ";
  return new Promise((resolve, reject) => {
    req.con.query(sql, [req.params.hotel_id], function (err, hotels) {
      if (err) console.log(err);
      resolve(hotels)
    });
  });
}

function getPremiumHotels(req) {
  var sql = "SELECT * " +
    "FROM hotels,hotel_locations " +
    "WHERE hotels.premium=1 " +
    "AND hotels.id=hotel_locations.hotel_id";
  return new Promise((resolve, reject) => {
    req.con.query(sql, [], function (err, hotels) {
      if (err) console.log(err);
      resolve(hotels)
    });
  });
}

function getHotelAverageRating(req) {
  var sql = "SELECT AVG(customer_reviews.customer_review) AS avgRating " +
    "FROM customer_reviews " +
    "INNER JOIN reservations " +
    "ON customer_reviews.reservation_id = reservations.reservation_id " +
    "WHERE reservations.hotel_id = ?";
  return new Promise((resolve, reject) => {
    req.con.query(sql, [req.params.hotel_id], function (err, avgRating) {
      if (err) console.log(err);
      console.log(avgRating[0]);
      resolve(avgRating[0]);
    });
  });
}


function getOwnedHotelDetails(req) {
  var query1 = "SELECT * FROM hotels, facilities where hotels.id = ? AND hotels.id = facilities.hotel_id";
  var query2 = "SELECT * FROM room_type where hotel_id = ?";
  return new Promise((resolve, reject) => {
    req.con.query(query1, [req.params.hotel_id], function (err, hotels) {
      if (err) console.log(err);
      req.con.query(query2, [req.params.hotel_id], (err, rooms) => {
        if (err) console.log(err);
        resolve({
          hotel: hotels[0],
          rooms: rooms
        });
      });
    });
  });
}



module.exports = {
  insertHotel: insertHotel,
  getAllApprovedHotels: getAllApprovedHotels,
  getAllApprovedHotelsWithFacilities: getAllApprovedHotelsWithFacilities,
  getHotelDetails: getHotelDetails,
  getAllOwnedHotels: getAllOwnedHotels,
  getOwnedHotelDetails: getOwnedHotelDetails,
  getAllNonApprovedHotels,
  approveHotel,
  getHotelAverageRating,
  getHotelDetailsAndRooms,
  getPremiumHotels
};


function addLocationToQuery(req, sql) {
  if (req.query.country !== undefined) {
    sql = sql + " AND hotel_locations.country LIKE'%" + req.query.country + "%'";
  }
  sql = sql + ";";
  return sql;
}


function addFacilitiesToQuery(req, sql) {
  if (req.query.pool) {
    sql = sql + " AND facilities.pool = 1";
  }
  if (req.query.restaurant) {
    sql = sql + " AND facilities.restaurant= 1";
  }
  if (req.query.bar) {
    sql = sql + " AND facilities.bar = 1";
  }
  if (req.query.wifi) {
    sql = sql + " AND facilities.wifi = 1";
  }
  if (req.query.gym) {
    sql = sql + " AND facilities.gym = 1";
  }
  if (req.query.kids_area) {
    sql = sql + " AND facilities.kids_area = 1";
  }
  if (req.query.spa) {
    sql = sql + " AND facilities.spa = 1";
  }
  return sql;
}