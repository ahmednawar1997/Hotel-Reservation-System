var date = require('date-and-time');



function insertReservation(req) {
    var query = "INSERT INTO  reservations (hotel_id, customer_id, check_in_date, check_out_date, reservation_date) VALUES (?,?,?,?,?)";
    return new Promise((resolve, reject) => {
        var now = new Date();
        date.format(now, '[YYYY-MM-DD]');
        req.con.query(query, [req.params.hotel_id, req.user.id, req.body.checkin, req.body.checkout, now],
            (err, insertedReservation) => {
                if (err) throw err;
                console.log("inserted res");

                resolve(insertedReservation.insertId);
            });

    });

}


function insertReservedRoomsInReservation(req, reservation_id, index) {
    console.log("reserved rooms");
    var query = "INSERT INTO  reserved_rooms (reservation_id, room_type, number_of_rooms) VALUES (?,?,?)";
    return new Promise((resolve, reject) => {
        req.con.query(query, [reservation_id, req.body.room_types[index], req.body.numberOfRooms[index]],
            (err, insertedReservedRoom) => {
                if (err) throw err;
                resolve();
            });

    });

}
function getAllOwnerReservations(req) {
    var query = "SELECT hotels.name as hotel_name, reservations.* " +
        "FROM reservations, hotels, users " +
        "WHERE hotels.owner_id = ? AND " +
        "reservations.hotel_id = hotels.id " +
        "AND users.id = reservations.customer_id";
    return new Promise((resolve, reject) => {
        req.con.query(query, [req.user.id], (err, reservations) => {
            if (err) console.log(err);
            resolve(reservations);
        });
    });
}

function getAllOwnerUpcomingReservations(req) {
    var query = "SELECT hotels.name as hotel_name, reservations.* " +
        "FROM reservations, hotels, users " +
        "WHERE hotels.owner_id = ? AND " +
        "reservations.hotel_id = hotels.id " +
        "AND users.id = reservations.customer_id " +
        "AND reservations.check_in_date>=?";
    return new Promise((resolve, reject) => {
        var now = new Date();
        date.format(now, '[YYYY-MM-DD]');
        req.con.query(query, [req.user.id, now], (err, reservations) => {
            if (err) console.log(err);
            console.log(reservations);
            resolve(reservations);
        });
    });
}

function getAllOwnerPastReservations(req) {
    var query = "SELECT hotels.name as hotel_name, reservations.*, customer_reviews.customer_review " +
        "FROM reservations " +
        "INNER JOIN hotels " +
        "ON reservations.hotel_id = hotels.id " +
        "INNER JOIN users " +
        "ON reservations.customer_id = users.id " +
        "LEFT JOIN customer_reviews " +
        "ON reservations.reservation_id=customer_reviews.reservation_id " +
        "WHERE hotels.owner_id = ? AND reservations.check_in_date<?"
    return new Promise((resolve, reject) => {
        var now = new Date();
        date.format(now, '[YYYY-MM-DD]');
        req.con.query(query, [req.user.id, now], (err, reservations) => {
            if (err) console.log(err);
            console.log(reservations);
            resolve(reservations);
        });
    });
}



function insertCustomerReview(req, reservation_id, customer_rating) {
    var query = "INSERT INTO  customer_reviews (reservation_id, customer_review) VALUES (?,?)";
    return new Promise((resolve, reject) => {
        req.con.query(query, [reservation_id, customer_rating], (err, customer_review) => {
            if (err) console.log(err);
            console.log(customer_review);
            resolve(customer_review);
        });
    });
}

function insertCustomerReviewComment(req, reservation_id, customer_review) {
    var query = "UPDATE customer_reviews SET customer_comment = ? WHERE reservation_id = ?";
    return new Promise((resolve, reject) => {
        req.con.query(query, [customer_review, reservation_id], (err, customer_review) => {
            if (err) console.log(err);
            console.log(customer_review);
            resolve(customer_review);
        });
    });
}


function getAllOwnerReservationsWithRoomsDetails(req) {
    var query = "SELECT hotels.name as hotel_name, reservations.*, users.*, reserved_rooms.* " +
        "FROM reservations, hotels, users, reserved_rooms " +
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


function cancelReservationFromCustomer(req, reservation_id) {
    var query = "UPDATE reservations SET customer_approval = ? WHERE reservation_id = ?;";
    return new Promise((resolve, reject) => {
        req.con.query(query, [0, reservation_id], (err, updatedReservation) => {
            if (err) console.log(err);
            resolve(updatedReservation);
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
    var i = 1;
    var queryParams = [req.user.id, 0, 0, 0];
    if (req.query.checkin) {
        query = query + "AND reservations.check_in_date>=? ";
        queryParams[i++] = req.query.checkin;
    }
    if (req.query.checkout) {
        query = query + "AND reservations.check_out_date<=? ";
        queryParams[i++] = req.query.checkout;
    }
    if (req.query.interval === "all") {
    } else if (req.query.interval === "upcoming") {
        query = query + "AND reservations.check_in_date>=? ";
        queryParams[i++] = new Date();
    } else if (req.query.interval === "past") {
        query = query + "AND reservations.check_in_date<=? ";
        queryParams[i++] = new Date();
    }
    if (req.query.state === "all") {
    } else if (req.query.state === "cancelled") {
        query = query + "AND (reservations.hotel_approval=0 OR reservations.customer_approval=0) ";
    } else if (req.query.state === "pending") {
        query = query + "AND reservations.hotel_approval IS NULL ";
    } else if (req.query.state === "approved") {
        query = query + "AND reservations.hotel_approval=1 AND (reservations.customer_approval=1 OR reservations.customer_approval IS NULL) ";
    }

    return new Promise((resolve, reject) => {
        req.con.query(query, queryParams, (err, detailedReservations) => {
            if (err) console.log(err);
            resolve(detailedReservations);
        });
    });
}





module.exports = {
    insertReservation,
    insertReservedRoomsInReservation,
    insertCustomerReview,
    getAllOwnerReservations,
    getAllOwnerReservationsWithRoomsDetails,
    cancelReservationFromCustomer,
    getAllOwnerUpcomingReservations,
    getAllOwnerPastReservations,
    getAllOwnerReservationsWithRoomsDetailsBetweenDates,
    insertCustomerReviewComment
};