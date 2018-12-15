var express = require("express");
var router = express.Router();
var Hotel = require("../entities/Hotel");
var Room = require("../entities/Room");
var Reservation = require("../entities/Reservation");

router.get("/", isAuthenticated, (req, res) => {
    Reservation.getAllOwnerReservations(req).then(function(reservations){
        res.render("customerProfile", {message: req.flash('message'), reservations: reservations});
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