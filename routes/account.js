var express = require("express");
var router = express.Router();
var User = require("../models/user");
var id = require("shortid");
var passport = require("passport");
var passportConf = require("../config/passport");
var mongoose = require("mongoose");

router.get("/register", function(req, res, next) {
  res.render("brav/register", { message: req.flash("message") });
});
router.post("/register", function(req, res, next) {
  var user = new User();
  user.username = req.body.username;
  user.email = req.body.email;
  user.password = req.body.password;
  User.findOne(
    { $or: [{ email: req.body.email }, { username: req.body.username }] },
    function(_err, existingUser) {
      if (existingUser) {
        if (existingUser.email === req.body.email) {
          req.flash("message", "email already exist");
          res.redirect("/login");
        } else {
          req.flash("message", "username already exist");
          res.redirect("/login");
        }
      } else {
        user.save(function(err, user) {
          if (err) return next(err);
          req.logIn(user, function(err) {
            if (err) return next(err);
            res.redirect("/");
          });
        });
      }
    }
  );
});
router.get("/login", function(req, res, next) {
  res.render("brav/login", { message: req.flash("message") });
});

router.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

router.get("/logout", function(req, res, next) {
  req.logOut();
  res.redirect("/");
});

router.get("/", passportConf.isAuthenticated, function(req, res) {
  User.findById({ _id: req.user._id }, function(err, user) {
    var data = user.schedule;
    res.render("brav/index", { message: req.flash("message"), data: data });
  });
});

router.get("/profile", passportConf.isAuthenticated, function(req, res, next) {
  res.render("brav/profile");
});
router.post("/profile", passportConf.isAuthenticated, function(req, res, next) {
  User.findById({ _id: req.user._id }, function(err, user) {
    if (user) {
      user.name = req.body.name;
      user.gender = req.body.gender;
      user.address = req.body.address;
      user.timezone = req.body.timezone;
      user.phone = req.body.phone;
      user.languages = req.body.language.split(",");
      user.birthday = req.body.birthday;
      user.save(err => {
        res.redirect("/profile");
      });
    }
  });
});
router.get("/addaschedule", passportConf.isAuthenticated, function(
  req,
  res,
  next
) {
  res.render("brav/schedule", { message: req.flash("message") });
});
router.post("/addaschedule", passportConf.isAuthenticated, function(
  req,
  res,
  next
) {
  User.findById({ _id: req.user._id }, function(err, user) {
    if (user) {
      user.schedule.push({
        conflictname: req.body.conflictname,
        start: req.body.availability,
        partiesinconflict: req.body.partiesinconflict.split(","),
        title: req.body.description
      });
      user.save(err => {
        req.flash("message", "Added");
        res.redirect("/");
      });
    }
  });
});
router.get("/data", passportConf.isAuthenticated, function(req, res, next) {
  User.findById({ _id: req.user._id }, function(err, user) {
    res.json(user.schedule);
  });
});
module.exports = router;
