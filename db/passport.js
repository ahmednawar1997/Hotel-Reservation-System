var LocalStrategy     = require('passport-local').Strategy;
var bcrypt            = require('bcrypt');
var date              = require('date-and-time');

const saltRounds = 10;

module.exports = function(passport) {


passport.use('sign-in', new LocalStrategy({

    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true

  }, function (req, username, password, done){
  
        if(!username || !password) { return done(null, false, req.flash('message','All fields are required.')); }
  
        req.con.query("select * from users where username = ?", [username], function(err, rows){
            
        if (err) return done();

        if(!rows.length){ return done(null, false, req.flash('message','Invalid username or password.')); }
        
        var dbPassword  = rows[0].password;

        if(!bcrypt.compareSync(password, dbPassword)){
            return done(null, false, req.flash('message','Invalid username or password.'));
        }
        let now = new Date();
        date.format(now, '[YYYY-MM-DD]'); 
        req.con.query("UPDATE users SET last_login_date = ? WHERE username = ? " , [now, username], function(err, updatedRows){
            if(err) console.log(err);
        return done(null, rows[0].user_id, req.flash('message','Signed In Successfully'));
        });
  
        });
  
      }
  
  ));


passport.use('sign-up', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'pwd1',
    passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, username, password, done) {
    console.log('local signup');

    // we are checking to see if the user trying to login already exists
    req.con.query("select * from users where username = ? or email = ?", [username, req.body.email], function(err, users){
        // if there are any errors, return the error
        if (err)
            return done(err);

        // check to see if theres already a user with that username
        if (users.length > 0) {
            console.log('Email in use');
            return done(null, false, req.flash('message', 'That email or username is already taken.'));
        } else {

            // if there is no user with that username, create 

            var now = new Date();
            date.format(now, 'YYYY-MM-DD'); 

            var passwordHash = bcrypt.hashSync(password, saltRounds);

            var sql = "INSERT INTO users (email, username, password, registration_date) VALUES (?, ?, ?, ?)";
            req.con.query(sql, [ req.body.email, username, passwordHash, now], function(err, user) {
                if(err) console.log(err);
                else{
                    return done(null, user.insertId, req.flash('message', 'Signed Up Successful'));
                }
            });
        }

    });    

}));
  

passport.serializeUser(function(userId, done){
    done(null, userId);
});

passport.deserializeUser(function(req, id, done){
    req.con.query("select * from users where user_id = ? ", [id], function (err, users){
        done(err, users[0]);
    });
});
}