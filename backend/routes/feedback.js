const express = require("express");
const Feedback = require("../models/Feedback");
const auth = require("../middleware/auth");
const router = express.Router();

// Submit Feedback
router.post("/", auth, async (req, res) => {
    try {
        const { userID, message } = req.body;
        const feedback = await Feedback.create({ userID, message });
        res.json(feedback);
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

// Get all Feedback
router.get("/", async (req, res) => {
    const feedbacks = await Feedback.findAll();
    res.json(feedbacks);
});

module.exports = router;