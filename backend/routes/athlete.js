const express = require("express");
const Athlete = require("../models/Athlete");
const auth = require("../middleware/auth");
const router = express.Router();
const User = require("../models/User");

// Add an Athlete
router.post("/", auth, async (req, res) => {
    try {
        const { name, age, category, achievements } = req.body;
        const athlete = await Athlete.create({ name, age, category, achievements });
        res.json(athlete);
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

// Get all Athletes
router.get("/", async (req, res) => {
    try {
      const athletes = await Athlete.find(); // ✅ Ensure it fetches from MongoDB
      console.log("📢 API Response:", athletes);
      res.json(athletes);
    } catch (error) {
      console.error("❌ Server Error:", error);
      res.status(500).json({ error: "Server Error" });
    }
  });
  
  // ✅ Get Single Athlete by ID
  router.get("/:id", async (req, res) => {
    try {
      const athlete = await Athlete.findById(req.params.id);
      if (!athlete) return res.status(404).json({ error: "Athlete not found" });
      res.json(athlete);
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
  });
  
  // ✅ Add a New Athlete
  router.post("/", async (req, res) => {
    try {
      const { name, age, category, achievements } = req.body;
      const newAthlete = new Athlete({ name, age, category, achievements });
      await newAthlete.save();
      res.status(201).json(newAthlete);
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
  });
  
  // ✅ Update Athlete
  router.put("/:id", async (req, res) => {
    try {
      const { name, age, category, achievements } = req.body;
      const updatedAthlete = await Athlete.findByIdAndUpdate(
        req.params.id,
        { name, age, category, achievements },
        { new: true } // ✅ Returns the updated document
      );
      res.json(updatedAthlete);
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
  });
  
  // ✅ Delete Athlete
  router.delete("/:id", async (req, res) => {
    try {
      await Athlete.findByIdAndDelete(req.params.id);
      res.json({ msg: "Athlete deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
  });

  // ✅ Get All Athletes for Admin
  router.get("/admin/athletes", auth, async (req, res) => {
    try {
      const athletes = await User.find({ role: "Athlete" }).populate("instituteId", "name");
      
      // ✅ Append full image URL
      const updatedAthletes = athletes.map(athlete => ({
        ...athlete._doc,
        image: athlete.image ? `http://localhost:8000${athlete.image}` : "/default-profile.png"
      }));
  
      res.json(updatedAthletes);
    } catch (error) {
      console.error("🔥 Error fetching athletes:", error);
      res.status(500).json({ msg: "Server error", error: error.message });
    }
  });
  

  router.delete("/admin/athletes/:id", auth , async (req, res) => {
    try {
      console.log("🗑 Delete request for athlete:", req.params.id);
  
      const athlete = await User.findById(req.params.id);
      if (!athlete) {
        return res.status(404).json({ msg: "Athlete not found." });
      }
  
      await User.findByIdAndDelete(req.params.id);
  
      res.json({ msg: "Athlete deleted successfully." });
    } catch (error) {
      console.error("🔥 Error deleting athlete:", error);
      res.status(500).json({ msg: "Server error", error: error.message });
    }
  });
  
module.exports = router;