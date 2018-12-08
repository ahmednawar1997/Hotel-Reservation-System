var express = require('express');
var router = express.Router();


router.get('/',isAuthenticated, function(req, res, next){
	res.render('hotels', {message: req.flash('message')});
});

router.get('/getHotels', isAuthenticated, function(req, res, next){
  console.log(req.body);
  res.render('hotels', {message: req.flash('message')});
});



module.exports = router;

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}