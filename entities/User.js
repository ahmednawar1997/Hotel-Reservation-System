var date = require('date-and-time');



function getAllCustomers(req, customer_name) {
    var query = "SELECT id, name FROM users WHERE name LIKE'%" + customer_name + "%'";
    return new Promise((resolve, reject) => {
        req.con.query(query, [],
            (err, customers) => {
                if (err) throw err;
                resolve(customers);
            });
    });
}

function getUserDetails(req, customer_id) {
    var query = "SELECT * FROM users LEFT JOIN blacklist ON users.id = blacklist.customer_id WHERE users.id = ?";
    return new Promise((resolve, reject) => {
        req.con.query(query, [customer_id],
            (err, customer) => {
                if (err) throw err;
                resolve(customer);
            });
    });
}

function blacklistUser(req, customer_id) {
    var query = "INSERT INTO  blacklist (customer_id, block_date) VALUES (?,?)";
    return new Promise((resolve, reject) => {
        var now = new Date();
        date.format(now, '[YYYY-MM-DD]');
        req.con.query(query, [customer_id, now],
            (err, customer) => {
                if (err) throw err;
                resolve(customer);
            });
    });
}
function removeBlacklistUser(req, customer_id) {
    var query = "DELETE FROM blacklist WHERE customer_id=?";
    return new Promise((resolve, reject) => {
        var now = new Date();
        date.format(now, '[YYYY-MM-DD]');
        req.con.query(query, [customer_id],
            (err, customer) => {
                if (err) throw err;
                resolve(customer);
            });
    });
}



module.exports = {
    getAllCustomers,
    getUserDetails,
    blacklistUser,
    removeBlacklistUser
};