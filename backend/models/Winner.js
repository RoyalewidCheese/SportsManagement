const mongoose = require("mongoose");

const winnerSchema = new mongoose.Schema({
  athlete: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament", required: true },
  position: {
    type: String,
    enum: ["1st", "2nd", "3rd"],
    required: true
  },
  prizeAmount: { type: Number, required: true }, // 💰 Prize Money
  awardTitle: { type: String, required: true }, // 🏅 Special Award
  awardedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Issued by Council
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Winner", winnerSchema);
