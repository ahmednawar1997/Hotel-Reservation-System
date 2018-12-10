var express = require("express");
var router = express.Router();
var Hotel = require("../entities/hotel");

router.get("/", isAuthenticated, function(req, res, next) {
  Hotel.getAllApprovedHotelsWithFacilities(req).then(hotels => {
    res.render("hotels", { message: req.flash('message'), hotels: hotels , query : req.query});
  });
});

router.get("/getHotels", isAuthenticated, function(req, res, next) {
  Hotel.getAllApprovedHotelsWithFacilities(req).then(hotels => {
    res.status(202).send(hotels);
  });
});

router.get("/:hotel_id", isAuthenticated, function(req, res, next) {
  Hotel.getHotelDetails(req).then(hotel => {
    res.render("viewHotel", { message: req.flash('message'), hotel : hotel});
  });
});

module.exports = router;

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}