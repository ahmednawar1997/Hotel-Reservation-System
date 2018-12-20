var express = require("express");
var router = express.Router();
var Hotel = require("../entities/Hotel");
var Room = require("../entities/Room");
var Reservation = require("../entities/Reservation");

router.get("/", isAuthenticated, (req, res) => {
    Reservation.getAllOwnerUpcomingReservations(req).then(function(upcomingReservations){
        Reservation.getAllOwnerPastReservations(req).then(function(pastReservations){
            if(req.user.type==="broker"){
                Hotel.getAllNonApprovedHotels(req).then(function(notApprovedHotels){
                    res.render("userProfile", {message: req.flash('message'), upcomingReservations: upcomingReservations,
                    pastReservations: pastReservations, notApprovedHotels: notApprovedHotels});
                });
            }else{
            
                res.render("userProfile", {message: req.flash('message'), upcomingReservations: upcomingReservations,
                pastReservations: pastReservations, notApprovedHotels:{}});
            }
            });
    });

});

router.get("/owner/reservations", isAuthenticated, isHotelOwner, (req, res, next) => {
  console.log("Request fl route: ", req.body);
  Reservation.getAllOwnerReservationsWithRoomsDetailsBetweenDates(req).then(detailedReservations => {
    res.render("reservations", { message: req.flash('message'), detailedReservations });
  })

});

router.get("/owner/hotels", isAuthenticated, isHotelOwner, (req, res, next) => {
  Hotel.getAllOwnedHotels(req).then(hotels => {
    res.render("ownersHotels", { message: req.flash('message'), hotels: hotels });
  });
});

router.get("/owner/register-hotel", isAuthenticated, isHotelOwner, (req, res, next) => {
  res.render("registerHotel", { message: req.flash('message') });
});


router.post("/owner/register-hotel", isAuthenticated, isHotelOwner, (req, res, next) => {
  Hotel.insertHotel(req).then(() => {
    Hotel.getAllOwnedHotels(req).then(hotels => {
      res.render("ownersHotels", { message: req.flash('message'), hotels: hotels });
    });
  });
});


router.get("/owner/:hotel_id(\\d+)/", isAuthenticated, isHotelOwner, (req, res, next) => {
    Hotel.getOwnedHotelDetails(req).then(hotelObj => {
      res.render("viewOwnedHotel", { message: req.flash('message'), hotel: hotelObj.hotel, rooms: hotelObj.rooms });
    });
  });

router.post("/owner/:hotel_id(\\d+)/", isAuthenticated, isHotelOwner, (req, res, next) => {
  Room.insertRoom(req).then(() => {
    Hotel.getOwnedHotelDetails(req).then(hotelObj => {
      res.render("viewOwnedHotel", { hotel: hotelObj.hotel, rooms: hotelObj.rooms, message: req.flash('message') });
    });
  })
});

router.get("/admin/hotels", isAuthenticated, function(req, res, next) {
  Hotel.getAllApprovedHotels(req).then(hotels => {
    res.render("brokerHotels", { hotels: hotels,  message: req.flash('message') });
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