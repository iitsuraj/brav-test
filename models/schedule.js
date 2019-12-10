var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");
var crypto = require("crypto");

var ScheduleSchema = new Schema(
  {
    from: { type: Schema.Types.ObjectId, ref: "User" },
    to: { type: Schema.Types.ObjectId, ref: "User" },
    start: { type: Date, default: Date.now() },
    title: String,
    accept: { type: Boolean, default: false },
    passcode: { type: String }
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updateAt"
    }
  }
);
module.exports = mongoose.model("Schedule", ScheduleSchema);
