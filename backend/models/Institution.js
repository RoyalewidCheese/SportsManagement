const mongoose = require("mongoose");

const institutionSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // ✅ Ensure auto _id
  name: { type: String, required: true },
  location: { type: String, required: true },
});

module.exports = mongoose.model("Institution", institutionSchema);
