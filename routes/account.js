var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Schedule = require("../models/schedule");
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
router.get("/data", passportConf.isAuthenticated, function(req, res, next) {
  Schedule.find({ from: req.user._id }, function(err, data) {
    res.json(data);
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
  if (req.body.conflictname.toLowerCase() === req.user.username) {
    req.flash("message", "Okk Set a alarm for u");
    res.redirect("/addaschedule");
    return 0;
  }
  User.findOne({ username: req.body.conflictname.toLowerCase() }, function(
    err,
    user
  ) {
    if (err) return next(err);
    // console.log(user)
    if (!user) {
      req.flash("message", "No username found with this username");
      res.redirect("/addaschedule");
      return 0;
    }
    var schedule = new Schedule();
    schedule.from = req.user._id;
    schedule.to = user._id;
    schedule.start = req.body.availability;
    schedule.title = req.body.description;
    schedule.passcode = id.generate();
    schedule.save(function(err) {
      req.flash("message", "Added Sucessfully");
      res.redirect("/addaschedule");
    });
  });
});

router.get("/call", passportConf.isAuthenticated, function(req, res, next) {
  res.render("brav/call");
});
router.post("/call", passportConf.isAuthenticated, function(req, res, next) {
  if (req.body.roomid) {
    Schedule.findById({ _id: req.body.roomid }).exec((err, metting) => {
      if (!metting) {
        req.flash("message", "no metting");
        res.redirect("/");
        return 0;
      }
      res.render("brav/roomcreate", { metting: metting.passcode });
    });
  } else {
    res.render("brav/roomcreate", { passcode: req.body.roompassword });
  }
});
router.get("/mettings", passportConf.isAuthenticated, function(req, res, next) {
  Schedule.find({ to: req.user._id })
    .sort({ createdAt: -1 })
    .populate("from", ["username"])
    .exec(function(err, mettings) {
      res.render("brav/metting", { mettings: mettings });
      // console.log(mettings);
    });
});
module.exports = router;
