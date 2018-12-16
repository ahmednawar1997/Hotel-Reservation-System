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
                    console.log(notApprovedHotels);
                    res.render("customerProfile", {message: req.flash('message'), upcomingReservations: upcomingReservations,
                    pastReservations:pastReservations,notApprovedHotels:notApprovedHotels});
                });
            }else{
            
                res.render("customerProfile", {message: req.flash('message'), upcomingReservations: upcomingReservations,
                pastReservations:pastReservations,notApprovedHotels:{}});
            }
            });
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