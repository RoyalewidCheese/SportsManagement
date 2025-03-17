const express = require("express");
const Tournament = require("../models/Tournament");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const router = express.Router();

// Add a Tournament
router.post("/", auth, async (req, res) => {
    try {
        console.log("📥 Incoming Tournament Data:", req.body); // Debugging
        const { name, date, location, category } = req.body;
        const createdBy = req.user?.id; // Get user ID from token

        if (!name || !date || !location || !createdBy) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const tournament = await Tournament.create({ name, date, location, category, createdBy });
        res.json(tournament);
    } catch (error) {
        console.error("🔥 Error saving tournament:", error.message);
        res.status(500).json({ error: "Server Error", details: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const tournaments = await Tournament.find();
        res.json(tournaments);
    } catch (error) {
        console.error("🔥 Error fetching tournaments:", error.message);
        res.status(500).json({ error: "Server Error", details: error.message });
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const tournamentId = req.params.id;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
            return res.status(400).json({ error: "Invalid tournament ID format" });
        }

        console.log(`🗑 Deleting tournament ID: ${tournamentId}`);

        const deletedTournament = await Tournament.findByIdAndDelete(tournamentId);

        if (!deletedTournament) {
            return res.status(404).json({ error: "Tournament not found" });
        }

        res.json({ message: "Tournament deleted successfully" });
    } catch (error) {
        console.error("🔥 Error deleting tournament:", error.message);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

// Update a Tournament
router.put("/:id", auth, async (req, res) => {
    try {
        const tournamentId = req.params.id;
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
            return res.status(400).json({ error: "Invalid tournament ID format" });
        }

        console.log(`✏️ Updating tournament ID: ${tournamentId}`);

        const updatedTournament = await Tournament.findByIdAndUpdate(
            tournamentId,
            req.body,
            { new: true, runValidators: true } // Ensure validation
        );

        if (!updatedTournament) {
            return res.status(404).json({ error: "Tournament not found" });
        }

        res.json({ message: "Tournament updated successfully", updatedTournament });
    } catch (error) {
        console.error("🔥 Error updating tournament:", error.message);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

// ✅ GET All Tournaments (Admin View)
router.get("/", auth, async (req, res) => {
    try {
      const tournaments = await Tournament.find();
      res.json(tournaments);
    } catch (error) {
      console.error("🔥 Error fetching tournaments:", error);
      res.status(500).json({ msg: "Server error", error: error.message });
    }
  });
  
  // ✅ CREATE New Tournament (Admin Only)
  router.post(
    "/",
    [
      auth,
      check("name", "Tournament name is required").not().isEmpty(),
      check("date", "Valid tournament date is required").isISO8601(),
      check("location", "Location is required").not().isEmpty(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
      try {
        const { name, date, location, category } = req.body;
        const tournament = new Tournament({ name, date, location, category });
  
        await tournament.save();
        res.status(201).json({ msg: "Tournament created successfully", tournament });
      } catch (error) {
        console.error("🔥 Error creating tournament:", error);
        res.status(500).json({ msg: "Server error", error: error.message });
      }
    }
  );
  
  // ✅ UPDATE Tournament (Admin Only)
  router.put("/:id", auth, async (req, res) => {
    try {
      const { name, date, location, category } = req.body;
      const updatedTournament = await Tournament.findByIdAndUpdate(
        req.params.id,
        { name, date, location, category },
        { new: true }
      );
  
      if (!updatedTournament) return res.status(404).json({ msg: "Tournament not found" });
  
      res.json({ msg: "Tournament updated successfully", updatedTournament });
    } catch (error) {
      console.error("🔥 Error updating tournament:", error);
      res.status(500).json({ msg: "Server error", error: error.message });
    }
  });
  
  // ✅ DELETE Tournament (Admin Only)
  router.delete("/:id", auth, async (req, res) => {
    try {
      const deletedTournament = await Tournament.findByIdAndDelete(req.params.id);
      if (!deletedTournament) return res.status(404).json({ msg: "Tournament not found" });
  
      res.json({ msg: "Tournament deleted successfully" });
    } catch (error) {
      console.error("🔥 Error deleting tournament:", error);
      res.status(500).json({ msg: "Server error", error: error.message });
    }
  });

module.exports = router;