var express = require('express');
var router = express.Router();
var Hotel  = require('../entities/hotel');


module.exports = function(passport) {



router.get('/', function(req, res, next) {
	res.render('');
});
	

router.get('/login', function(req, res, next) {
	res.render('login', {message: req.flash('message')});
});


router.post('/login', passport.authenticate('local', {
	successRedirect: '/home',
	failureRedirect: '/login',
	failureFlash: true
	})
);

router.get('/register', function(req, res, next) {
	res.render('registration',{message: req.flash('message')});
});


router.post('/register', passport.authenticate('local-signup', {
	successRedirect : '/home',
	failureRedirect : '/register',
	failureFlash : true 
}));


router.get('/home', isAuthenticated, function(req, res, next) {
	res.render('home',{message: req.flash('message') });
});


router.get('/logout', function(req, res){
	req.logout();
	req.flash('message','You just logged out');
  res.redirect('/login');
});


router.get('/wat', function(req, res, next) {
  var db = req.con;
	var data = "";
	db.query('SELECT * FROM users', function(err, rows){
		if(err) throw err;
		
	  console.log('Data received from Db:\n');
		console.log(rows);
		var data = rows;
		res.render('index', { title: 'User Information', dataGet: data });
	});

});



module.exports = router;
return router;
}

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}

