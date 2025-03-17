const express = require("express");
const authMiddleware = require("../middleware/auth");
const User = require("../models/User");
const mongoose = require("mongoose");
const Institution = require("../models/Institution");
const Tournament = require("../models/Tournament");
const Application = require("../models/Application");

const router = express.Router();

// ✅ Fetch only athletes from this institution who are participating in tournaments
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("🔹 Incoming monitoring request from user ID:", req.user.id);

    // Find the user
    const user = await User.findById(req.user.id);
    if (!user) {
      console.error("❌ User not found.");
      return res.status(404).json({ msg: "User not found." });
    }

    // Ensure only institutions can access this route
    if (user.role !== "Institution") {
      console.error("❌ Access denied. User is not an institution.");
      return res.status(403).json({ msg: "Access denied. Only institutions can monitor athletes." });
    }

    console.log("✅ Institution ID from user:", user.instituteId);

    if (!user.instituteId) {
      console.error("❌ Institution ID missing from user.");
      return res.status(400).json({ msg: "Institution ID is missing for this user." });
    }

    // Ensure the institution exists
    const institution = await Institution.findById(new mongoose.Types.ObjectId(user.instituteId));
    if (!institution) {
      console.error("❌ Institution not found.");
      return res.status(404).json({ msg: "Institution not found." });
    }

    console.log("✅ Institution found:", institution._id);

    // Find all athletes from this institution
    const athletes = await User.find({ instituteId: institution._id, role: "Athlete" })
      .select("_id name email admissionNumber image");

    if (athletes.length === 0) {
      console.warn("⚠️ No registered athletes found for this institution.");
      return res.status(404).json({ msg: "No registered athletes found under this institution." });
    }

    console.log("✅ Athletes found:", athletes.length);

    // Get athletes' IDs
    const athleteIds = athletes.map(athlete => athlete._id);

    // Find applications of athletes who have applied for tournaments
    const participations = await Application.find({ athlete: { $in: athleteIds } })
      .populate("athlete", "name email admissionNumber image")
      .populate("tournament", "name location date");

    if (participations.length === 0) {
      console.warn("⚠️ No athletes from this institution have registered for tournaments.");
      return res.status(404).json({ msg: "No athletes from this institution are participating in tournaments." });
    }

    console.log("✅ Tournament participations found:", participations.length);
    res.json(participations);
  } catch (error) {
    console.error("🔥 Error fetching monitoring data:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
