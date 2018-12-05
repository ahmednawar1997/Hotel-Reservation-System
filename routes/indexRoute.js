var express = require('express');
var router = express.Router();


module.exports = function(passport) {

router.get('/login', function(req, res, next) {
	res.render('login');
});


router.post('/login', passport.authenticate('local', {
	successRedirect: '/home',
	failureRedirect: '/login',
	failureFlash: true
	})
);

router.get('/register', function(req, res, next) {
	res.render('registration');
});


router.post('/register', passport.authenticate('local-signup', {
	successRedirect : '/home',
	failureRedirect : '/register',
	failureFlash : true 
}));


router.get('/home', isAuthenticated, function(req, res, next) {
	res.render('home',{message: req.flash('message') });
});

router.get('/hotels', function(req, res, next){
	res.render('hotels', {message: req.flash('message') });
});

router.get('/logout', function(req, res){
  req.logout();
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

function isAuthenticated(req, res, next) {

  if (req.isAuthenticated())

    return next();

  res.redirect('/login');

}

module.exports = router;
return router;
}

