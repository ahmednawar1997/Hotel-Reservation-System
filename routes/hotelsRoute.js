var express = require('express');
var router = express.Router();


module.exports = function(passport) {

router.get('/',isAuthenticated, function(req, res, next){
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