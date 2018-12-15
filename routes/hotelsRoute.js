var express = require("express");
var router = express.Router();
var Hotel = require("../entities/Hotel");
var Room = require("../entities/Room");
var Reservation = require("../entities/Reservation");
var date = require('date-and-time');

router.get("/", isAuthenticated, function(req, res, next) {
  
  if(req.query.checkin == undefined || req.query.checkout == undefined){
    addCheckinAndCheckoutDates(req);
  }
  Hotel.getAllApprovedHotelsWithFacilities(req).then(hotels => {
    res.render("hotels", { message: req.flash('message'), hotels: hotels , query : req.query});
  });
});

router.get("/getHotels", isAuthenticated, function(req, res, next) {
  Hotel.getAllApprovedHotelsWithFacilities(req).then(hotels => {
    res.status(202).send(hotels);
  });
});

router.get("/:hotel_id(\\d+)/", isAuthenticated, function(req, res, next) {
  Hotel.getHotelDetails(req).then(hotel => {
    res.render("viewHotel", { message: req.flash('message'), hotel : hotel});
  });
});


router.get("/:hotel_id(\\d+)/reserve", isAuthenticated, function(req, res){
  Hotel.getHotelDetails(req).then(function(hotel){
    Room.getRoomsByHotelId(req).then(function(rooms){
      res.render("viewRegistration", { message: req.flash('message'), hotel: hotel, query: req.query, rooms: rooms});
    });

  });
});


router.post("/:hotel_id(\\d+)/reserve", isAuthenticated, function(req, res){

  Reservation.insertReservation(req).then(function(reservation_id){

    (req.body.room_types).forEach((room_type, index) => {
      console.log("Index: " + index);
      Reservation.insertReservedRoomsInReservation(req, reservation_id, index)
      req.flash('message', 'Reservation Successful');
      res.redirect('/home');
    });

  });

});



module.exports = router;

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

function addCheckinAndCheckoutDates(req){
  var now = new Date();
  date.format(now, '[YYYY-MM-DD]');
  console.log(now);
  var dateOnlyToday = JSON.stringify(now).substring(1, 11);
  req.query.checkin = dateOnlyToday;
  now = date.addDays(now, 2);
  var dateOnlyAfterTwoDays = JSON.stringify(now).substring(1, 11);
  req.query.checkout = dateOnlyAfterTwoDays;
}
