var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require("../models/user");

// serialize and desilalrige
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// midelware
passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      PasswordField: "password",
      passReqToCallback: true
    },
    function(req, email, password, done) {
      User.findOne({ email: email }, function(err, user) {
        if (err) return done(err);
        if (!user) {
          return done(
            null,
            false,
            req.flash("message", "no user has benn found")
          );
        }
        if (!user.comparePassword(password)) {
          return done(
            null,
            false,
            req.flash("message", "oops! wrong password")
          );
        }
        return done(null, user);
      });
    }
  )
);

// custom function to validate
exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};
exports.isAdmin = function(req, res, next) {
  if (req.isAuthenticated()) {
    // return next();
    if (req.user.role == "admin") {
      return next();
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/login");
  }
};
