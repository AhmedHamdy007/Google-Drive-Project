const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  matricNo: { type: String, required: true },
  subject: { type: String, required: true },
  time: { type: String, required: true }, // Format: "10:00-12:00"
  day: { type: String, required: true },
  location: { type: String },
});

module.exports = mongoose.model('Timetable', timetableSchema);
