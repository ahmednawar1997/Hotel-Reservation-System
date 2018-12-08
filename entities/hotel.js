function getAllHotels(req) {}
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

module.exports = {
  getAllHotels: getAllHotels,
  insertHotel: insertHotel
};
