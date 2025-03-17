const mongoose = require("mongoose");

const sponsorshipSchema = new mongoose.Schema({
  athlete: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sponsor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amountRequested: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Sponsorship", sponsorshipSchema);
