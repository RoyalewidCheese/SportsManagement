const express = require("express");
const Application = require("../models/Application");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// ✅ Submit a tournament application
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { tournament, tournamentName, location } = req.body;

    if (!tournament) {
      return res.status(400).json({ msg: "Tournament ID is required" });
    }

    const application = new Application({
      athlete: req.user.id,
      tournament,
      tournamentName,
      location,
      status: "Pending",
    });

    await application.save();
    res.status(201).json(application);
  } catch (error) {
    console.error("🔥 Server Error:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.get("/my", authMiddleware, async (req, res) => {
  try {
    console.log("🔹 Request User ID:", req.user.id);

    const applications = await Application.find({ athlete: req.user.id })
      .populate("athlete", "name email") 
      .populate("tournament", "name location"); // ✅ Ensure tournament details are populated

    console.log("📥 Applications Found:", applications);

    if (!applications.length) {
      return res.status(200).json([]); // ✅ Return an empty array instead of 404
    }

    res.json(applications);
  } catch (error) {
    console.error("🔥 Server Error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});


// ✅ Fetch all applications (For Council Panel)
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("📢 Fetching all applications...");
    
    const applications = await Application.find()
      .populate("athlete", "name email")
      .populate("tournament", "name location");

    console.log("📥 Applications Found:", applications);

    if (!applications.length) {
      return res.status(404).json({ msg: "No applications found" });
    }

    res.json(applications);
  } catch (error) {
    console.error("🔥 Server Error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});


router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("📢 Fetching all applications...");
    
    const applications = await Application.find()
      .populate("athlete", "name email")
      .populate({
        path: "tournament",
        select: "name location", // Ensure location is included
      });

    console.log("📥 Applications Found:", applications);

    if (!applications.length) {
      return res.status(404).json({ msg: "No applications found" });
    }

    res.json(applications);
  } catch (error) {
    console.error("🔥 Server Error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});


router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ msg: "Application not found" });
    }

    if (application.athlete.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to delete this application" });
    }

    await application.deleteOne();
    res.json({ msg: "Application deleted successfully" });
  } catch (error) {
    console.error("🔥 Error deleting application:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ✅ Update application status (Approve or Reject)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    console.log(`📢 Updating application: ${req.params.id} Status: ${req.body.status}`);

    const application = await Application.findById(req.params.id).populate("tournament");

    if (!application) {
      return res.status(404).json({ msg: "Application not found" });
    }

    if (!req.body.tournament) {
      return res.status(400).json({ msg: "Tournament ID is required for update" });
    }

    // ✅ Ensure only council members can approve/reject applications
    if (req.user.role !== "SportsCouncil") {
      return res.status(403).json({ msg: "Access denied. Only council members can modify applications." });
    }

    application.status = req.body.status;
    application.tournament = req.body.tournament; // Ensure tournament ID is updated
    await application.save();

    res.json({ msg: "Application status updated successfully", application });
  } catch (error) {
    console.error("🔥 Error updating application:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;