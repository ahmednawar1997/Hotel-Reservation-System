var express = require("express");
var router = express.Router();
var dbAccess = require("../entities/hotel");

router.get("/",isAuthenticated, isHotelOwner, (req, res, next) => {
  dbAccess.getAllOwnedHotels(req).then(hotels => {
    res.render("ownersHotels", { message: req.flash('message'), hotels: hotels});
  });
});

router.get("/register-hotel",isAuthenticated, isHotelOwner, (req, res, next) => {
  res.render("registerHotel", { message: req.flash('message')});
});

router.post("/register-hotel",isAuthenticated, isHotelOwner, (req, res, next) => {
  dbAccess.insertHotel(req).then(() => {
    dbAccess.getAllOwnedHotels(req).then(hotels => {
      res.render("ownersHotels", { message: req.flash('message'), hotels : hotels});
    });
  });
});

router.post("/:hotel_id(\\d+)/",isAuthenticated, isHotelOwner, (req, res, next) => {
  dbAccess.insertRooms(req).then(() => {
    dbAccess.getOwnedHotelDetails(req).then(hotelObj => {
      res.render("viewOwnedHotel", {hotelObj: hotelObj, message: req.flash('message')});
    });
  })
});

router.get("/:hotel_id(\\d+)/",isAuthenticated, isHotelOwner, (req, res, next) => {
  dbAccess.getOwnedHotelDetails(req).then(hotelObj => {
    res.render("viewOwnedHotel", { message: req.flash('message'), hotel: hotelObj.hotel, rooms:hotelObj.rooms});
  });
});




function isHotelOwner(req, res, next) {
  if(req.user.type !== 'hotel_owner' && req.user.type !== 'broker'){
    req.flash('message', 'You don\'t have authorization to complete this action');
    res.redirect("/login");
    return;
    //req.path
  }
  return next();
}


function isAuthenticated(req, res, next) {
  if (!req.isAuthenticated()){
    req.flash('message', 'You must be logged in to complete this action');
    res.redirect("/login");
    return;
  }
  return next();
}


module.exports = router;
