var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");
var crypto = require("crypto");

var ScheduleSchema = new Schema(
  {
    conflictname: {
      type: String,
      lowercase: true
    },
    availability: { type: Date, default: Date.now() },
    partiesinconflict: [String],
    description: String
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updateAt"
    }
  }
);
module.exports = mongoose.model("Schedule", ScheduleSchema);
