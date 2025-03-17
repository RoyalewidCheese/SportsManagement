const express = require("express");
const User = require("../models/User");
const router = express.Router();

// ✅ Get all users OR filter by role
router.get("/", async (req, res) => {
    try {
        const { role } = req.query;
        let users;

        if (role) {
            users = await User.find({ role }).select("name email role image");
        } else {
            users = await User.find().select("name email role image");
        }

        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/", async (req, res) => {
    try {
        const { role } = req.query;
        let users;

        if (role) {
            users = await User.find({ role: role }).select("name email role"); // Ensure role filter works
        } else {
            users = await User.find().select("name email role");
        }

        res.json(users);
    } catch (error) {
        console.error("🔥 Error fetching users:", error.message);
        res.status(500).json({ error: "Server error" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ msg: "User not found" });
        res.json({ msg: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

module.exports = router;