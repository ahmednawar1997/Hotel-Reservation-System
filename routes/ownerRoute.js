var express = require("express");
var router = express.Router();
var Hotel = require("../entities/Hotel");
var Room = require("../entities/Room");
var reservations = require("../entities/mshReservations");

router.get("/reservations", isAuthenticated, isHotelOwner, (req, res, next) => {
  reservations.getAllOwnerReservationsWithRoomsDetails(req).then(detailedReservations => {
    res.render("reservations", { message: req.flash('message'), detailedReservations });
  })

});

router.get("/", isAuthenticated, isHotelOwner, (req, res, next) => {
  Hotel.getAllOwnedHotels(req).then(hotels => {
    res.render("ownersHotels", { message: req.flash('message'), hotels: hotels });
  });
});

router.get("/register-hotel", isAuthenticated, isHotelOwner, (req, res, next) => {
  res.render("registerHotel", { message: req.flash('message') });
});

router.post("/register-hotel", isAuthenticated, isHotelOwner, (req, res, next) => {
  Hotel.insertHotel(req).then(() => {
    Hotel.getAllOwnedHotels(req).then(hotels => {
      res.render("ownersHotels", { message: req.flash('message'), hotels: hotels });
    });
  });
});

router.post("/:hotel_id(\\d+)/", isAuthenticated, isHotelOwner, (req, res, next) => {
  Room.insertRoom(req).then(() => {
    Hotel.getOwnedHotelDetails(req).then(hotelObj => {
      res.render("viewOwnedHotel", { hotel: hotelObj.hotel, rooms: hotelObj.rooms, message: req.flash('message') });
    });
  })
});

router.get("/:hotel_id(\\d+)/", isAuthenticated, isHotelOwner, (req, res, next) => {
  Hotel.getOwnedHotelDetails(req).then(hotelObj => {
    res.render("viewOwnedHotel", { message: req.flash('message'), hotel: hotelObj.hotel, rooms: hotelObj.rooms });
  });
});




function isHotelOwner(req, res, next) {
  if (req.user.type !== 'hotel_owner' && req.user.type !== 'broker') {
    req.flash('message', 'You don\'t have authorization to complete this action');
    res.redirect("/login");
    return;
    //req.path
  }
  return next();
}


function isAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash('message', 'You must be logged in to complete this action');
    res.redirect("/login");
    return;
  }
  return next();
}


module.exports = router;
