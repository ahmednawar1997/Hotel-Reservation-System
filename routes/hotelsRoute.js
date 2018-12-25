var express = require("express");
var router = express.Router();
var Hotel = require("../entities/Hotel");
var Room = require("../entities/Room");
var Reservation = require("../entities/Reservation");
var date = require('date-and-time');
var auth = require("../helpers/authorization");

router.get("/", auth.isAuthenticated, auth.isCustomer,auth.isBlacklisted, function (req, res, next) {

  if (req.query.checkin == undefined || req.query.checkout == undefined) {
    addCheckinAndCheckoutDates(req);
  }

  Hotel.getAllAvailableRoomsWithHotels(req, req.query.checkin, req.query.checkout).then(rooms => {

      res.render("hotels", {
        message: req.flash('message'),
        query: req.query,
        rooms:rooms
      });
    });

});

router.get("/:hotel_id(\\d+)/", auth.isAuthenticated, function (req, res, next) {
  Hotel.getHotelDetailsAndRooms(req).then(hotels => {
    Hotel.getPremiumHotels(req).then(premiumHotels => {
      Hotel.getCustomerReviews(req).then(reviews => {
        console.log(reviews);
        res.render("viewHotel2", {
          message: req.flash('message'),
          hotels,
          premiumHotels,
          reviews
        });
      });
    });
  })

});

router.get("/fetch-hotels/", auth.isAuthenticated, function (req, res, next) {
  Hotel.fetchHotelsWithName(req, req.query.hotel_name).then(function (hotels) {
    res.status(202).send(hotels);
  })
});



router.get("/:hotel_id(\\d+)/reserve", auth.isAuthenticated, auth.isCustomer, function (req, res) {
  Hotel.getHotelDetails(req).then(function (hotel) {
    Room.getRoomsByHotelId(req).then(function (rooms) {
      Room.getNumberOfRooms(req, req.params.hotel_id, req.query.checkin, req.query.checkout).then(function (availableRooms) {
        res.render("reservationForm", {
          message: req.flash('message'),
          hotel: hotel,
          query: req.query,
          rooms: availableRooms
        });
      });

    });
  });
});

router.get("/:hotel_id(\\d+)/book", auth.isAuthenticated, auth.isCustomer, function (req, res) {
  Hotel.getHotelDetails(req).then(function (hotel) {
    Room.getNumberOfRooms(req, req.params.hotel_id, req.query.checkin, req.query.checkout).then(function (availableRooms) {
      var checkin = req.query.checkin;
      var checkout = req.query.checkout;
      addCheckinAndCheckoutDates(req);
      var data = {
        hotel: hotel,
        checkin: checkin,
        checkout: checkout,
        rooms: availableRooms
      }
      res.status(202).send(data);
    });
  });
});


router.post("/:hotel_id(\\d+)/reserve", auth.isAuthenticated, auth.isCustomer, function (req, res) {

  Reservation.insertReservation(req).then(function (reservation_id) {

    if (((req.body.room_types) instanceof Array)) {
      (req.body.room_types).forEach((room_type, index) => {
        Reservation.insertReservedRoomsInReservation(req, reservation_id, req.body.room_types[index], req.body.room_views[index], req.body.numberOfRooms[index]);
      });

    } else {
      Reservation.insertReservedRoomsInReservation(req, reservation_id, req.body.room_types, req.body.room_views, req.body.numberOfRooms);
    }
    req.flash('message', 'Reservation Successful');
    res.redirect('/hotels');
  });

});

router.post("/approve", auth.isAuthenticated, auth.isBroker, function (req, res) {

  Hotel.approveHotel(req).then(function (hotel_id) {
    req.flash('message', 'Hotel Approved');
    res.status(202).send('success');

  });

});


router.post("/premium", auth.isAuthenticated, auth.isBroker, function (req, res) {

  Hotel.addPremiumHotel(req).then(function (hotel_id) {
    req.flash('message', 'Hotel is now Premium');
    res.status(202).send('success');

  });

});

router.post("/removepremium", auth.isAuthenticated, auth.isBroker, function (req, res) {

  Hotel.removePremiumHotel(req).then(function (hotel_id) {
    req.flash('message', 'Hotel is now not Premium');
    res.status(202).send('success');

  });

});

router.post("/suspend", auth.isAuthenticated, auth.isBroker, function (req, res) {

  Hotel.suspendHotel(req).then(function (hotel_id) {
    req.flash('message', 'Hotel is now suspended');
    res.status(202).send('success');

  });

});

router.post("/reactivate", auth.isAuthenticated, auth.isBroker, function (req, res) {

  Hotel.reactivateHotel(req).then(function (hotel_id) {
    req.flash('message', 'Hotel is now reactivated');
    res.status(202).send('success');

  });

});




router.post("/rate", auth.isAuthenticated, auth.isCustomer, function (req, res) {
  Reservation.insertCustomerReview(req, req.body.reservation_id, req.body.customer_rating).then(function (reservation_id) {
    req.flash('message', 'Rated your visit with ' + req.body.customer_rating + " stars successfully");
    res.status(202).send('success');
  });
});


router.post("/review", auth.isAuthenticated, auth.isCustomer, function (req, res) {

  Reservation.insertCustomerReviewComment(req, req.body.reservation_id, req.body.customer_review).then(function (reservation_id) {
    res.status(202).send('success');
  });
});



module.exports = router;


function addCheckinAndCheckoutDates(req) {
  var now = new Date();
  date.format(now, '[YYYY-MM-DD]');
  var dateOnlyToday = JSON.stringify(now).substring(1, 11);
  req.query.checkin = dateOnlyToday;
  now = date.addDays(now, 2);
  var dateOnlyAfterTwoDays = JSON.stringify(now).substring(1, 11);
  req.query.checkout = dateOnlyAfterTwoDays;
}