const mongoose = require("mongoose");

const councilSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Council", councilSchema);