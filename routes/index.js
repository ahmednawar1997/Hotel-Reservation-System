var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
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
