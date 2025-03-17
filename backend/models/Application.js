const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  athlete: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament", required: true },
  tournamentName: { type: String, required: true },
  location: { type: String },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Application", applicationSchema);
