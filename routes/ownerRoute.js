var express = require("express");
var router = express.Router();
var dbAccess = require("../entities/hotel");

router.get("/", isAuthenticated, (req, res, next) => {
  dbAccess.getAllOwnedHotels(req).then(hotels => {
    res.render("ownersHotels", { hotels: hotels });
  });
});

router.get("/register-hotel", isAuthenticated, (req, res, next) => {
  res.render("registerHotel");
});

router.post("/register-hotel", isAuthenticated, (req, res, next) => {
  dbAccess.insertHotel(req).then(() => {
    dbAccess.getAllOwnedHotels(req).then(hotels => {
      res.render("ownersHotels", { hotels: hotels });
    });
  });
});

router.post("/:hotel_id", isAuthenticated, (req, res, next) => {
  dbAccess.insertRooms(req).then(() => {
    dbAccess.getOwnedHotelDetails(req).then(hotelObj => {
      res.render("viewOwnedHotel", hotelObj);
    });
  })
});

router.get("/:hotel_id", isAuthenticated, (req, res, next) => {
  dbAccess.getOwnedHotelDetails(req).then(hotelObj => {
    res.render("viewOwnedHotel", hotelObj);
  });
});




function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}
module.exports = router;
