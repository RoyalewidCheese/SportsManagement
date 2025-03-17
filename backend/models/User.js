const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Admin", "Athlete", "Sponsor", "SportsCouncil", "Institution"],
    required: true,
  },
  image: { type: String, required: false },
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: "Institution" }, // ✅ Store Institution ID
  admissionNumber: { type: String },
}, { timestamps: true });


userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.statics.fetchAthletes = async function() {
  return await this.find({ role: "Athlete" }).select("name email role image");
};

userSchema.statics.fetchCouncilMembers = async function() {
  return await this.find({ role: "SportsCouncil" }).select("name email role image");
};

// ✅ Fetch Athletes Registered by a Specific Institution
userSchema.statics.fetchInstitutionAthletes = async function (institutionId) {
  return await this.find({ role: "Athlete", instituteId: institutionId }).select("name email admissionNumber image");
};

module.exports = mongoose.model("User", userSchema);