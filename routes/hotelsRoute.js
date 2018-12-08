var express = require('express');
var router = express.Router();


module.exports = function(passport) {

router.get('/',isAuthenticated, function(req, res, next){
  console.log("checkin: "+req.query.checkin);
	res.render('hotels', {message: req.flash('message')});
});

router.get('/getHotels', isAuthenticated, function(req, res, next){
  console.log(req.body);
  res.render('hotels', {message: req.flash('message')});
});













module.exports = router;
return router;
}

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}