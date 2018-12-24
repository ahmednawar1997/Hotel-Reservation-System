var express = require("express");
var router = express.Router();
var Reservation = require("../entities/Reservation");
var auth = require("../helpers/authorization");

router.get("/", auth.isAuthenticated, (req, res) => {
    Reservation.getAllOwnerReservations(req).then(function(reservations){
        console.log(reservations);
        res.render("customerProfile", {message: req.flash('message'), reservations: reservations});
    });

});

router.post("/cancel", auth.isAuthenticated, function(req, res){
    Reservation.cancelReservationFromCustomer(req, req.body.reservation_id).then(function(updatedReservation){
      req.flash('message', 'Reservation Cancelled');
      res.status(202).send('success');
  
    });  
});

module.exports = router;