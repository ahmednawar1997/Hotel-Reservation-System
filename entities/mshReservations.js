function getAllOwnerReservations(req) {
    var query = "SELECT * FROM reservations,hotels,customers " +
        "WHERE hotels.owner_id=?" +
        "reservations.hotel_id = hotels.id " +
        "AND customers.id = reservations.customer_id";
    return new Promise((resolve, reject) => {
        req.con.query(query, [req.user.id], (err, reservations) => {
            if (err) console.log(err);
            resolve(reservations);
        });
    });
}

function getAllOwnerReservationsWithRoomsDetails(req) {
    var query = "SELECT hotels.name as hotel_name,reservations.*,customers.*,reserved_rooms.* " +
        "FROM reservations,hotels,customers,reserved_rooms " +
        "WHERE hotels.owner_id=? " +
        "AND reservations.hotel_id=hotels.id " +
        "AND customers.id=reservations.customer_id " +
        "AND reserved_rooms.reservation_id=reservations.reservation_id";
    return new Promise((resolve, reject) => {
        req.con.query(query, [req.user.id], (err, detailedReservations) => {
            if (err) console.log(err);
            console.log(detailedReservations);
            resolve(detailedReservations);
        });
    });
}

module.exports = {
    getAllOwnerReservations,
    getAllOwnerReservationsWithRoomsDetails
}