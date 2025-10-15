const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema({
  email: String,
  nickname: String,
});

const commentSchema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const reservationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  memo: String,
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  maxPeople: { type: Number, default: 1 },
  currentPeople: { type: Number, default: 0 },
  applicants: [applicantSchema],
  comments: [commentSchema],
});

module.exports = mongoose.model("Reservation", reservationSchema);
