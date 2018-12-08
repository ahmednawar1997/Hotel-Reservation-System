var Hotel={
    getAllApprovedHotels: getAllApprovedHotels

};

var getAllApprovedHotels = function(req){
    var sql = "SELECT * FROM hotels where approved = ?";
            req.con.query(sql, [1], function(err, hotels) {
                if(err) console.log(err);
                else{
                    return hotels;
                }  
            });
}


module.exports = Hotel;
