var express = require('express');
var router = express.Router();
var Hotel  = require('../entities/hotel');
var multer  = require('multer');

var storage = require('../helpers/uploadFile');
var upload = multer({ storage: storage }); 


module.exports = function(passport) {



router.get('/', function(req, res, next) {
	res.redirect('/login');
});
	

router.get('/login', function(req, res, next) {
	req.logOut();
	res.render('login', {message: req.flash('message')});
});


router.post('/login', passport.authenticate('sign-in', {
	successRedirect: '/home',
	failureRedirect: '/login',
	failureFlash: true
	})
);

router.get('/register', function(req, res, next) {
	res.render('registration',{message: req.flash('message')});
});


router.post('/register', upload.single('avatar'), passport.authenticate('sign-up', {
	successRedirect : '/home',
	failureRedirect : '/register',
	failureFlash : true 
}));


router.get('/home', isAuthenticated, function(req, res, next) {
	res.render('home', {message: req.flash('message')});
});


router.get('/logout', function(req, res){
	req.logout();
	req.flash('message','You just logged out');
  res.redirect('/login');
});


router.get('/test', isAuthenticated, function(req, res){
  	res.render('test', {message: req.flash('message')});
});


module.exports = router;
return router;
}

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}

