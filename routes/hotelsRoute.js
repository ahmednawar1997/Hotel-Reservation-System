var express = require("express");
var router = express.Router();
var dbAccess = require("../entities/hotel");

router.get("/", isAuthenticated, function(req, res, next) {
  dbAccess.getAllApprovedHotelsWithFacilities(req).then(hotels => {
    res.render("hotels", { hotels: hotels });
  });
});

router.get("/getHotels", isAuthenticated, function(req, res, next) {
  dbAccess.getAllApprovedHotels(req).then(hotels => {
    res.status(202).send(hotels);
  });
});
module.exports = router;

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}
