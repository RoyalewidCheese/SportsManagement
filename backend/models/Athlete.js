const mongoose = require("mongoose");

const athleteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  category: { type: String, required: true },
  achievements: { type: [String], default: [] }, // Array of achievements
});

module.exports = mongoose.model("Athlete", athleteSchema);