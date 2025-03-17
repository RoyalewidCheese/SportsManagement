const express = require("express");
const authMiddleware = require("../middleware/auth");
const User = require("../models/User");
const Tournament = require("../models/Tournament");
const Institution = require("../models/Institution");
const Sponsor = require("../models/Sponsor");

const router = express.Router();

// ✅ Middleware to check if the user is an admin
const adminMiddleware = async (req, res, next) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== "Admin") {
      return res.status(403).json({ msg: "Access denied. Admins only." });
    }
    next();
  } catch (error) {
    console.error("🔥 Admin Middleware Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Fetch all users (Institutions, Athletes, Sponsors, Councils)
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("🔥 Error fetching users:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Update a user's details
router.put("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();
    res.json({ msg: "User updated successfully", user });
  } catch (error) {
    console.error("🔥 Error updating user:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Delete a user
router.delete("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error("🔥 Error deleting user:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Fetch all tournaments
router.get("/tournaments", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    res.json(tournaments);
  } catch (error) {
    console.error("🔥 Error fetching tournaments:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Update a tournament
router.put("/tournaments/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, location, date } = req.body;
    let tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ msg: "Tournament not found" });

    tournament.name = name || tournament.name;
    tournament.location = location || tournament.location;
    tournament.date = date || tournament.date;

    await tournament.save();
    res.json({ msg: "Tournament updated successfully", tournament });
  } catch (error) {
    console.error("🔥 Error updating tournament:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Delete a tournament
router.delete("/tournaments/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ msg: "Tournament not found" });

    await Tournament.findByIdAndDelete(req.params.id);
    res.json({ msg: "Tournament deleted successfully" });
  } catch (error) {
    console.error("🔥 Error deleting tournament:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Fetch all institutions
router.get("/institutions", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const institutions = await Institution.find();
    res.json(institutions);
  } catch (error) {
    console.error("🔥 Error fetching institutions:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Fetch all sponsors
router.get("/sponsors", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const sponsors = await Sponsor.find();
    res.json(sponsors);
  } catch (error) {
    console.error("🔥 Error fetching sponsors:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
