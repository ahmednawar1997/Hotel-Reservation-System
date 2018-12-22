var express = require("express");
var router = express.Router();
var Hotel = require("../entities/Hotel");
var Room = require("../entities/Room");
var Reservation = require("../entities/Reservation");
var date = require('date-and-time');

router.get("/", isAuthenticated, function (req, res, next) {

  if (req.query.checkin == undefined || req.query.checkout == undefined) {
    addCheckinAndCheckoutDates(req);
  }
  Hotel.getAllApprovedHotelsWithFacilities(req).then(hotels => {

    res.render("hotels", { message: req.flash('message'), hotels: hotels, query: req.query });
  });
});

router.get("/getHotels", isAuthenticated, function (req, res, next) {
  Hotel.getAllApprovedHotelsWithFacilities(req).then(hotels => {
    res.status(202).send(hotels);
  });
});

router.get("/:hotel_id(\\d+)/", isAuthenticated, function (req, res, next) {
  Hotel.getHotelDetailsAndRooms(req).then(hotels => {
    Hotel.getPremiumHotels(req).then(premiumHotels => {
      Hotel.getCustomerReviews(req).then(reviews => {
        console.log("HOTELSATY: ", reviews);
        res.render("viewHotel2", { message: req.flash('message'), hotels, premiumHotels, reviews });
      });
    });
  })

});

// router.get("/:hotel_id(\\d+)/", isAuthenticated, function (req, res, next) {
//   Hotel.getHotelDetails(req).then(hotel => {
//     Hotel.getHotelAverageRating(req).then(avgRating => {
//       hotel.avg_rating = avgRating.avgRating;
//       res.render("viewHotel", { message: req.flash('message'), hotel: hotel });
//     })

//   });
// });


router.get("/:hotel_id(\\d+)/reserve", isAuthenticated, function(req, res){
  Hotel.getHotelDetails(req).then(function(hotel){
    Room.getRoomsByHotelId(req).then(function(rooms){
      Room.getNumberOfRooms(req, req.params.hotel_id, req.query.checkin, req.query.checkout).then(function(availableRooms){
        res.render("reservationForm", { message: req.flash('message'), hotel: hotel, query: req.query, rooms: availableRooms});    
        });

    });
  });
});


router.post("/:hotel_id(\\d+)/reserve", isAuthenticated, function (req, res) {

  Reservation.insertReservation(req).then(function (reservation_id) {

    (req.body.room_types).forEach((room_type, index) => {
      console.log("Index: " + index);
      Reservation.insertReservedRoomsInReservation(req, reservation_id, index)
      req.flash('message', 'Reservation Successful');
      res.redirect('/home');
    });

  });

});

router.post("/approve", isAuthenticated, function (req, res) {

  Hotel.approveHotel(req).then(function (hotel_id) {
    req.flash('message', 'Hotel Approved');
    res.status(202).send('success');

  });

});

router.post("/rate", isAuthenticated, function (req, res) {
  console.log("res__id: " + req.body.reservation_id);

  Reservation.insertCustomerReview(req, req.body.reservation_id, req.body.customer_rating).then(function (reservation_id) {
    console.log(reservation_id);
    req.flash('message', 'Rated your visit with ' + req.body.customer_rating + " stars successfully");
    res.status(202).send('success');
  });
});


router.post("/review", isAuthenticated, function (req, res) {

  Reservation.insertCustomerReviewComment(req, req.body.reservation_id, req.body.customer_review).then(function (reservation_id) {
    console.log(reservation_id);
    res.status(202).send('success');
  });
});



module.exports = router;

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

function addCheckinAndCheckoutDates(req) {
  var now = new Date();
  date.format(now, '[YYYY-MM-DD]');
  console.log(now);
  var dateOnlyToday = JSON.stringify(now).substring(1, 11);
  req.query.checkin = dateOnlyToday;
  now = date.addDays(now, 2);
  var dateOnlyAfterTwoDays = JSON.stringify(now).substring(1, 11);
  req.query.checkout = dateOnlyAfterTwoDays;
}
