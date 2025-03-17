const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
  },
  { timestamps: true } // Adds `createdAt` and `updatedAt`
);

module.exports = mongoose.model("Feedback", feedbackSchema);