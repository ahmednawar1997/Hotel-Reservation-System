var express = require("express");
var router = express.Router();
var dbAccess = require("../entities/hotel");

router.get("/", isAuthenticated, (req, res, next) => {
  res.render("registerHotel");
});

router.post("/", isAuthenticated, (req, res, next) => {
  dbAccess.insertHotel(req).then(() => {
    res.send("POSTED HOTEL");
  });
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}
module.exports = router;
