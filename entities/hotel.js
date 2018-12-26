function insertHotel(req) {
  var query1 = "INSERT INTO  hotels (name, owner_id, stars, description, image_path, map_url) VALUES (?,?,?,?,?,?)";
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
  var imagePath;
  if (req.file) {
    imagePath = req.file.filename;
  } else {
    imagePath = null;
  }

  return new Promise((resolve, reject) => {
    req.con.query(query1, [req.body.hotelname, req.user.id, req.body.stars, req.body.description, imagePath, req.body.map_url],
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


function fetchHotelsWithName(req, hotel_name) {
  var query = "SELECT id, name FROM hotels WHERE name LIKE'%" + hotel_name + "%'";
  return new Promise((resolve, reject) => {
    req.con.query(query, [],
      (err, hotels) => {
        if (err) throw err;
        resolve(hotels);
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

function getAllOwnedHotelsWithRoomsAndFacilities(req) {
  var sql = "SELECT * " +
    "FROM hotels, facilities, hotel_locations " +
    "LEFT JOIN room_type " +
    "ON hotel_locations.hotel_id = room_type.hotel_id " +
    "WHERE hotels.owner_id=? " +
    "AND hotels.id=facilities.hotel_id " +
    "AND hotels.id=hotel_locations.hotel_id " +
    "ORDER BY hotels.name";
  return new Promise((resolve, reject) => {
    req.con.query(sql, [req.user.id], function (err, hotels) {
      if (err) console.log(err);
      resolve(hotels)
    });
  });
}

function getAllApprovedHotels(req) {
  var sql = "SELECT hotels.*, hotel_locations.*, users.name AS hotel_owner_name, T1.res_count " +
    "FROM hotels " +
    "INNER JOIN hotel_locations " +
    "ON hotels.id = hotel_locations.hotel_id " +
    "INNER JOIN users " +
    "ON hotels.owner_id = users.id " +
    "LEFT JOIN " +
    "(SELECT hotels.id, COUNT(*) AS res_count FROM " +
    "hotels INNER JOIN reservations ON hotels.id = reservations.hotel_id " +
    "GROUP BY hotels.id) AS T1 " +
    "ON T1.id= hotels.id";
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


function addPremiumHotel(req) {
  var sql = "UPDATE hotels SET premium = ? WHERE id = ?;";
  return new Promise((resolve, reject) => {
    req.con.query(sql, [1, req.body.hotel_id], function (err, hotel) {
      if (err) console.log(err);
      resolve(hotel);
    });
  });
}

function removePremiumHotel(req) {
  var sql = "UPDATE hotels SET premium = ? WHERE id = ?;";
  return new Promise((resolve, reject) => {
    req.con.query(sql, [0, req.body.hotel_id], function (err, hotel) {
      if (err) console.log(err);
      resolve(hotel);
    });
  });
}


function suspendHotel(req) {
  var sql = "UPDATE hotels SET suspended = ? WHERE id = ?;";
  return new Promise((resolve, reject) => {
    req.con.query(sql, [1, req.body.hotel_id], function (err, hotel) {
      if (err) console.log(err);
      resolve(hotel);
    });
  });
}


function reactivateHotel(req) {
  var sql = "UPDATE hotels SET suspended = ? WHERE id = ?;";
  return new Promise((resolve, reject) => {
    req.con.query(sql, [0, req.body.hotel_id], function (err, hotel) {
      if (err) console.log(err);
      resolve(hotel);
    });
  });
}

function getAllApprovedHotelsWithFacilities(req) {
  var sql = "SELECT hotels.*, facilities.*, hotel_locations.*, T1.avgRating " +
    "FROM hotels " +
    "INNER JOIN facilities ON hotels.id = facilities.hotel_id " +
    "INNER JOIN hotel_locations ON hotels.id = hotel_locations.hotel_id " +
    "LEFT JOIN " +
    "(SELECT reservations.hotel_id, AVG(customer_reviews.customer_review) AS avgRating FROM " +
    "reservations INNER JOIN customer_reviews ON customer_reviews.reservation_id = reservations.reservation_id " +
    "GROUP BY reservations.hotel_id) AS T1 " +
    "ON T1.hotel_id = hotels.id " +
    "WHERE hotels.approved = 1 AND hotels.suspended = 0"
  sql = addFacilitiesToQuery(req, sql);
  sql = addFiltersToQuery(req, sql);
  return new Promise((resolve, reject) => {
    req.con.query(sql, [1], function (err, hotels) {
      if (err) console.log(err);
      resolve(hotels);
    });
  });
}


function getAllAvailableRoomsWithHotels(req, checkin, checkout) {

  var sql1 = "SELECT T3.*, T2.* FROM " +
    "((SELECT hotels.id AS kofta, hotels.name, hotels.description, hotels.stars, hotels.image_path, hotel_locations.*, T1.avgRating " +
    "FROM hotels " +
    "INNER JOIN facilities ON hotels.id = facilities.hotel_id " +
    "INNER JOIN hotel_locations ON hotels.id = hotel_locations.hotel_id " +
    "LEFT JOIN " +
    "(SELECT reservations.hotel_id, AVG(customer_reviews.customer_review) AS avgRating FROM " +
    "reservations INNER JOIN customer_reviews ON customer_reviews.reservation_id = reservations.reservation_id " +
    "GROUP BY reservations.hotel_id) AS T1 " +
    "ON T1.hotel_id = hotels.id " +
    "WHERE hotels.approved = 1 AND hotels.suspended = 0";

  sql1 = addFacilitiesToQuery(req, sql1);
  sql1 = addFiltersToQuery(req, sql1);

  var sql2 = ")AS T3) INNER JOIN ((SELECT total_number_of_rooms.hotel_id, total_number_of_rooms.room_type, total_number_of_rooms.room_view, total_number_of_rooms.price, sum1-IFNULL(sum2, 0) AS free_rooms " +
    "FROM " +
    "(SELECT room_type.hotel_id, room_type.room_type, room_type.room_view, room_type.price, SUM(room_type.number_of_rooms) AS sum1 " +
    "FROM room_type " +
    "GROUP BY room_type.room_type, room_type.room_view, room_type.price, room_type.hotel_id) AS total_number_of_rooms " +
    "LEFT OUTER JOIN " +
    "((SELECT booked_hotels.room_type, booked_hotels.hotel_id, booked_hotels.reservation_id, booked_hotels.room_view, SUM(booked_hotels.number_of_rooms) AS sum2 " +
    "FROM " +
    "((SELECT input_conditions.hotel_id, reserved_rooms.reservation_id, reserved_rooms.room_type, reserved_rooms.number_of_rooms, reserved_rooms.room_view FROM reserved_rooms " +
    "INNER JOIN " +
    "(SELECT reservations.reservation_id AS reservation_id ,reservations.hotel_id AS hotel_id FROM reservations WHERE " +
    "((? >= reservations.check_in_date AND ? < reservations.check_out_date) " +
    "OR (? <= reservations.check_in_date AND ? > reservations.check_in_date AND ? < reservations.check_out_date) " +
    "OR (? >= reservations.check_in_date AND ? < reservations.check_out_date)) AND customer_approval = ? " +
    ")AS input_conditions " +
    "ON reserved_rooms.reservation_id=input_conditions.reservation_id)AS booked_hotels) " +
    "GROUP BY booked_hotels.room_type,booked_hotels.hotel_id,booked_hotels.room_view) AS number_of_reserved_rooms) " +
    "ON number_of_reserved_rooms.room_type=total_number_of_rooms.room_type " +
    "AND number_of_reserved_rooms.hotel_id=total_number_of_rooms.hotel_id " +
    "AND number_of_reserved_rooms.room_view=total_number_of_rooms.room_view " +
    ")AS T2) ON T3.kofta = T2.hotel_id ORDER BY T2.hotel_id";

  return new Promise((resolve, reject) => {
    req.con.query(sql1 + sql2, [checkin, checkin, checkin, checkout, checkin, checkin, checkout, 1], function (err, hotels) {
      if (err) console.log(err);
      console.log(hotels);
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
      resolve(hotels[0]);
    });
  });
}

function getHotelDetailsAndRooms(req) {
  var sql = "SELECT * " +
    "FROM hotels, facilities, hotel_locations " +
    "LEFT JOIN room_type " +
    "ON hotel_locations.hotel_id = room_type.hotel_id " +
    "WHERE hotels.id=? AND hotels.id=facilities.hotel_id " +
    "AND hotels.id=hotel_locations.hotel_id ";
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
    "AND hotels.id=hotel_locations.hotel_id " +
    "AND hotel_locations.city=(SELECT hotel_locations.city " +
    "FROM hotel_locations WHERE hotel_locations.hotel_id =? ) ";
  return new Promise((resolve, reject) => {
    req.con.query(sql, [req.params.hotel_id], function (err, hotels) {
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

function getCustomerReviews(req) {
  var query = "SELECT * " +
    "FROM customer_reviews, reservations, users " +
    "WHERE customer_reviews.reservation_id=reservations.reservation_id " +
    "AND reservations.customer_id=users.id";

  return new Promise((resolve, reject) => {
    req.con.query(query, [], function (err, reviews) {
      if (err) console.log(err);
      resolve(reviews);
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
  getPremiumHotels,
  getCustomerReviews,
  addPremiumHotel,
  removePremiumHotel,
  reactivateHotel,
  suspendHotel,
  getAllOwnedHotelsWithRoomsAndFacilities,
  fetchHotelsWithName,
  getAllAvailableRoomsWithHotels

};

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

function addFiltersToQuery(req, sql) {

  if (req.query.country) {
    sql = sql + " AND hotel_locations.country LIKE'%" + req.query.country + "%'";
  }
  if (req.query.city) {
    sql = sql + " AND hotel_locations.city LIKE'%" + req.query.city + "%'";
  }
  if (req.query.min_rating) {
    sql = sql + " AND hotels.stars>='" + req.query.min_rating + "'";
  }
  if (req.query.max_rating) {
    sql = sql + " AND hotels.stars<='" + req.query.max_rating + "'";
  }
  return sql;



}