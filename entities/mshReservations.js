var date = require('date-and-time');

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
    var query = "SELECT hotels.name as hotel_name,reservations.*,users.*,reserved_rooms.* " +
        "FROM reservations,hotels,users,reserved_rooms " +
        "WHERE hotels.owner_id=? " +
        "AND reservations.hotel_id=hotels.id " +
        "AND users.id=reservations.customer_id " +
        "AND reserved_rooms.reservation_id=reservations.reservation_id";
    return new Promise((resolve, reject) => {
        req.con.query(query, [req.user.id], (err, detailedReservations) => {
            if (err) console.log(err);
            console.log("TESTTT", detailedReservations);
            resolve(detailedReservations);
        });
    });
}

function getAllOwnerReservationsWithRoomsDetailsBetweenDates(req) {
    var query = "SELECT hotels.name as hotel_name,reservations.*,users.*,reserved_rooms.* " +
        "FROM reservations,hotels,users,reserved_rooms " +
        "WHERE hotels.owner_id=? " +
        "AND reservations.hotel_id=hotels.id " +
        "AND users.id=reservations.customer_id " +
        "AND reserved_rooms.reservation_id=reservations.reservation_id ";
    if (req.query.checkin) {
        console.log("checkin: ", req.query.checkin);
        query = query + "AND reservations.check_in_date>=? ";
    }
    if (req.query.checkout) {
        console.log("checkout: ", req.query.checkout);
        query = query + "AND reservations.check_out_date<=?";
    }



    return new Promise((resolve, reject) => {
        req.con.query(query, [req.user.id, req.query.checkin, req.query.checkout], (err, detailedReservations) => {
            if (err) console.log(err);
            resolve(detailedReservations);
        });
    });
}

module.exports = {
    getAllOwnerReservations,
    getAllOwnerReservationsWithRoomsDetails,
    getAllOwnerReservationsWithRoomsDetailsBetweenDates
}