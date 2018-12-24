var express = require("express");
var multer = require('multer');
var router = express.Router();
var Hotel = require("../entities/Hotel");
var Room = require("../entities/Room");
var User = require("../entities/User");
var Reservation = require("../entities/Reservation");
var auth = require("../helpers/authorization");

var storage = require('../helpers/uploadFile');
var upload = multer({ storage: storage });


router.get("/", auth.isAuthenticated, (req, res) => {
  Reservation.getAllOwnerUpcomingReservations(req).then(function (upcomingReservations) {
    Reservation.getAllOwnerPastReservations(req).then(function (pastReservations) {
      if (req.user.type === "broker") {
        Hotel.getAllNonApprovedHotels(req).then(function (notApprovedHotels) {
          res.render("userProfile", {
            message: req.flash('message'), upcomingReservations: upcomingReservations,
            pastReservations: pastReservations, notApprovedHotels: notApprovedHotels
          });
        });
      } else {

        res.render("userProfile", {
          message: req.flash('message'), upcomingReservations: upcomingReservations,
          pastReservations: pastReservations, notApprovedHotels: {}
        });
      }
    });
  });

});
router.post("/owner/reservations", auth.isAuthenticated, auth.isHotelOwner, (req, res, next) => {
  Reservation.changeHotelApproval(req).then(() => {
    res.send("reservations");
  })


});


router.get("/owner/reservations", auth.isAuthenticated, auth.isHotelOwner, (req, res, next) => {
  Reservation.getAllOwnerReservationsWithRoomsDetailsBetweenDates(req).then(detailedReservations => {
    res.render("reservations", { message: req.flash('message'), detailedReservations });
  })

});

router.get("/owner/hotels", auth.isAuthenticated, auth.isHotelOwner, (req, res, next) => {
  Hotel.getAllOwnedHotelsWithRoomsAndFacilities(req).then(hotels => {
    console.log("output: ", hotels)
    res.render("ownersHotels", { message: req.flash('message'), hotels: hotels });
  });
});

router.get("/owner/register-hotel", auth.isAuthenticated, auth.isHotelOwner, (req, res, next) => {
  res.render("registerHotel", { message: req.flash('message') });
});


router.post("/owner/register-hotel", auth.isAuthenticated, auth.isHotelOwner, upload.single('avatar'), (req, res, next) => {
  Hotel.insertHotel(req).then(() => {
    Hotel.getAllOwnedHotels(req).then(hotels => {
      res.render("ownersHotels", { message: req.flash('message'), hotels: hotels });
    });
  });
});


router.get("/owner/:hotel_id(\\d+)/", auth.isAuthenticated, auth.isHotelOwner, (req, res, next) => {
  Hotel.getOwnedHotelDetails(req).then(hotelObj => {
    res.render("viewOwnedHotel", { message: req.flash('message'), hotel: hotelObj.hotel, rooms: hotelObj.rooms });
  });
});

// router.post("/owner/:hotel_id(\\d+)/", auth.isAuthenticated, auth.isHotelOwner, (req, res, next) => {
//   Room.insertRoom(req).then(() => {
//     Hotel.getOwnedHotelDetails(req).then(hotelObj => {
//       res.render("viewOwnedHotel", { hotel: hotelObj.hotel, rooms: hotelObj.rooms, message: req.flash('message') });
//     });
//   })
// });
router.post("/owner/:hotel_id(\\d+)/", auth.isAuthenticated, auth.isHotelOwner, (req, res, next) => {
  Room.insertRoom(req).then(() => {

    res.redirect('/user/owner/hotels');

  })
});

router.get("/admin/hotels", auth.isAuthenticated, auth.isBroker, function (req, res, next) {
  Hotel.getAllApprovedHotels(req).then(hotels => {
    res.render("brokerHotels2", { hotels: hotels, message: req.flash('message') });
  });
});

router.get("/customers", auth.isAuthenticated, function (req, res, next) {
  User.getAllCustomers(req, req.query.customer_name).then(customers => {
    res.status(202).send(customers);
  });
});


router.get("/customers/view", auth.isAuthenticated, auth.isBroker, function (req, res, next) {
  User.getUserDetails(req, req.query.customer_id).then(customer => {
    if (customer.length > 0) {
      res.render("viewUser", { customer: customer, message: req.flash('message') });
    } else {
      req.flash('message', 'User Not Found');
      res.redirect("/user/admin/hotels");

    }
  });
});

router.post("/:user_id(\\d+)/blacklist", auth.isAuthenticated, auth.isBroker, function (req, res, next) {
  User.blacklistUser(req, req.params.user_id).then(customer => {
    res.redirect('/user/customers/view?customer_id=' + req.params.user_id);
  });
});

router.post("/:user_id(\\d+)/blacklist/remove", auth.isAuthenticated, auth.isBroker, function (req, res, next) {
  User.removeBlacklistUser(req, req.params.user_id).then(customer => {
    res.redirect('/user/customers/view?customer_id=' + req.params.user_id);
  });
});

module.exports = router;