const express = require("express");
const Tournament = require("../models/Tournament");
const auth = require("../middleware/auth");
const router = express.Router();

// ✅ Fetch all tournaments for Admin
router.get("/", auth, async (req, res) => {
  try {
    const tournaments = await Tournament.find().populate("createdBy", "name");
    res.json(tournaments);
  } catch (error) {
    console.error("🔥 Error fetching tournaments:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ✅ Admin Create Tournament (With Image URL)
router.post("/", auth, async (req, res) => {
  try {
    const { name, date, location, image } = req.body;

    if (!name || !date || !location || !image) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    const tournament = new Tournament({
      name,
      date,
      location,
      image, // ✅ Now saving image as URL
      createdBy: req.user.id,
    });

    await tournament.save();
    res.status(201).json({ msg: "Tournament created successfully", tournament });
  } catch (error) {
    console.error("🔥 Error creating tournament:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ✅ Admin Update Tournament (With Image URL)
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, date, location, image } = req.body;

    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ msg: "Tournament not found." });
    }

    tournament.name = name;
    tournament.date = date;
    tournament.location = location;
    tournament.image = image; // ✅ Updating image as URL

    await tournament.save();
    res.json({ msg: "Tournament updated successfully", tournament });
  } catch (error) {
    console.error("🔥 Error updating tournament:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ✅ Admin Delete Tournament
router.delete("/:id", auth, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ msg: "Tournament not found." });
    }

    await Tournament.findByIdAndDelete(req.params.id);
    res.json({ msg: "Tournament deleted successfully." });
  } catch (error) {
    console.error("🔥 Error deleting tournament:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
