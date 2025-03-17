const express = require("express");
const Winner = require("../models/Winner");
const Tournament = require("../models/Tournament");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// ✅ Assign Winner with Constraints
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { athlete, tournament, position, prizeAmount, awardTitle } = req.body;

    // Ensure the user is a sports council member
    const councilMember = await User.findById(req.user.id);
    if (!councilMember || councilMember.role !== "SportsCouncil") {
      return res.status(403).json({ msg: "Only Sports Council members can assign winners" });
    }

    // Check if Tournament Registration is Closed
    const tournamentData = await Tournament.findById(tournament);
    if (!tournamentData) {
      return res.status(404).json({ msg: "Tournament not found" });
    }

    const currentDate = new Date();
    if (new Date(tournamentData.registrationDeadline) > currentDate) {
      return res.status(400).json({ msg: "Cannot assign winners before registration closes" });
    }

    // Ensure one winner per position per tournament
    const existingWinner = await Winner.findOne({ tournament, position });
    if (existingWinner) {
      return res.status(400).json({ msg: `A winner for ${position} place already exists in this tournament` });
    }

    // Assign Winner
    const winner = new Winner({
      athlete,
      tournament,
      position,
      prizeAmount,
      awardTitle,
      awardedBy: councilMember._id
    });

    await winner.save();
    res.status(201).json({ msg: "Winner assigned successfully", winner });

  } catch (error) {
    console.error("🔥 Error assigning winner:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ✅ Fetch Winners with Full Details
router.get("/", async (req, res) => {
  try {
    const winners = await Winner.find()
      .populate("athlete", "name image") // ✅ Include athlete's image
      .populate("tournament", "name location");

    res.json(winners);
  } catch (error) {
    console.error("🔥 Error fetching winners:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ✅ Fetch All Institutions
router.get("/institutions", async (req, res) => {
  try {
    const institutions = await Institution.find({});
    res.json(institutions);
  } catch (error) {
    res.status(500).json({ msg: "🔥 Error fetching institutions", error: error.message });
  }
});

// ✅ Fetch Athletes by Institution with Achievements
router.get("/athletes", async (req, res) => {
  try {
    const { institution } = req.query;
    if (!institution) return res.status(400).json({ msg: "Institution ID is required" });

    const athletes = await User.find({ role: "Athlete", institution: institution })
      .populate("institution", "name");

    // ✅ Fetch each athlete's achievements from Winner model
    const athleteData = await Promise.all(athletes.map(async (athlete) => {
      const achievements = await Winner.find({ athlete: athlete._id })
        .populate("tournament", "name") // Get tournament name
        .select("tournament position prizeAmount awardTitle createdAt");

      return { ...athlete.toObject(), achievements }; // Merge athlete details with achievements
    }));

    res.json(athleteData);
  } catch (error) {
    res.status(500).json({ msg: "🔥 Error fetching athletes", error: error.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const winner = await Winner.findById(req.params.id);

    if (!winner) {
      return res.status(404).json({ msg: "Winner not found" });
    }

    await winner.deleteOne();
    res.json({ msg: "Winner deleted successfully" });
  } catch (error) {
    console.error("🔥 Error deleting winner:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
