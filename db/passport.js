var LocalStrategy     = require('passport-local').Strategy;
var date              = require('date-and-time');


module.exports = function(passport) {


passport.use('sign-in', new LocalStrategy({

    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true

  }, function (req, email, password, done){
  
        if(!email || !password) { return done(null, false, req.flash('message','All fields are required.')); }
  
        req.con.query("select * from users where email = ?", [email], function(err, rows){
            
        if (err) return done();

        if(!rows.length){ return done(null, false, req.flash('message','Invalid email or password.')); }
        
        var dbPassword  = rows[0].password;

        
        if(password !== dbPassword){
            return done(null, false, req.flash('message','Invalid email or password.'));
        }
        let now = new Date();
        date.format(now, '[YYYY-MM-DD]'); 
        req.con.query("UPDATE users SET last_login_date = ? WHERE email = ? " , [now, email], function(err, updatedRows){
            if(err) console.log(err);
        return done(null, rows[0].id, req.flash('message','Signed In Successfully'));
        });
  
        });
  
      }
  
  ));


passport.use('sign-up', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'pwd1',
    passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, email, password, done) {
    // we are checking to see if the user trying to login already exists
    console.log('sign up');
    req.con.query("select * from users where email = ?", [email], function(err, users){
        // if there are any errors, return the error
        console.log(email);
        if (err){
            console.log(err);
            return done(err);}

        // check to see if theres already a user with that email
        if (users.length > 0) {
            console.log('Email in use');
            return done(null, false, req.flash('message', 'That email or email is already taken.'));
        } else {

            // if there is no user with that email, create 

            var now = new Date();
            date.format(now, 'YYYY-MM-DD'); 

            var passwordHash = password;
            var sql = "INSERT INTO users (name, email, password, registration_date, type, image_path) VALUES (?, ?, ?, ?, ?, ?)";
            req.con.query(sql, [ req.body.name, email, passwordHash, now, req.body.usertype, req.file.filename], function(err, user) {
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
    req.con.query("select * from users where id = ? ", [id], function (err, users){
        done(err, users[0]);
    });
});
}