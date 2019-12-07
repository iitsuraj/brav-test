var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");
var crypto = require("crypto");

var UserSchema = new Schema(
  {
    name: String,
    gender: String,
    address: String,
    timezone: String,
    phone: Number,
    languages: [String],
    birthday: { type: Date, default: Date.now() },
    username: { type: String, unique: true, required: true, lowercase: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: String,
    schedule: [
      {
        conflictname: {
          type: String,
          lowercase: true
        },
        start: { type: Date, default: Date.now() },
        partiesinconflict: [String],
        title: String
      }
    ]
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updateAt"
    }
  }
);

// hash
UserSchema.pre("save", function(next) {
  var user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

//password check
UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model("User", UserSchema);
