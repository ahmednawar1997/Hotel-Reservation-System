var express = require('express');
var router = express.Router();


router.get('/', isAuthenticated, function(req, res, next){
  var sql = "SELECT * FROM hotels, facilities where approved = ? AND hotels.id = facilities.hotel_id;";
    req.con.query(sql, [1], function(err, hotels) {
        if(err) console.log(err);
        else{
          res.render('hotels', {hotels:hotels});        
        }  
    });
    console.log("here");
	
});

router.get('/getHotels', isAuthenticated, function(req, res, next){
  var sql = "SELECT * FROM hotels where approved = ?";
    req.con.query(sql, [1], function(err, hotels) {
        if(err) console.log(err);
        else{
          res.status(202).send(hotels);
        }  
    });
 
});



module.exports = router;

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}