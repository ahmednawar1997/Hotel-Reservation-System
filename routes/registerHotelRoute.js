var express = require("express");
var router = express.Router();

router.get("/", isAuthenticated, (req, res, next) => {
  res.render("registerHotel");
});
router.post("/", isAuthenticated, (req, res, next) => {
  var query = "INSERT INTO  hotels (name, location) VALUES (?,?)";
  req.con.query(query, [req.body.hotelname, req.body.location], (err, rows) => {
    if (err) throw err;
    res.send("POSTED HOTEL");
  });
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}
module.exports = router;
