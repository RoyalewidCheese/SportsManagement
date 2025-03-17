const express = require("express");
const Sponsorship = require("../models/Sponsorship");
const authMiddleware = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();


// ✅ Apply for a sponsorship (Updated)
router.post("/apply", authMiddleware, async (req, res) => {
  try {
    const { sponsorId, amountRequested } = req.body;
    const athleteId = req.user.id; // Get athlete ID from token

    if (!sponsorId || !amountRequested) {
      return res.status(400).json({ msg: "Sponsor ID and Amount Requested are required" });
    }

    const sponsorship = new Sponsorship({
      athlete: athleteId, 
      sponsor: sponsorId,
      amountRequested,
      status: "Pending",
    });

    await sponsorship.save();
    res.status(201).json(sponsorship);
  } catch (error) {
    console.error("🔥 Error applying for sponsorship:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ✅ Fetch all sponsors (Only users with role: "Sponsor")
router.get("/", authMiddleware, async (req, res) => {
  try {
      const sponsors = await User.find({ role: "Sponsor" }).select("name email");
      res.json(sponsors);
  } catch (error) {
      console.error("🔥 Error fetching sponsors:", error);
      res.status(500).json({ msg: "Server error" });
  }
});


// ✅ Fetch sponsorships applied by the logged-in athlete
router.get("/my-sponsors", authMiddleware, async (req, res) => {
  try {
      const applications = await Sponsorship.find({ athlete: req.user.id }).populate("sponsor", "name");
      res.json(applications);
  } catch (error) {
      console.error("🔥 Error fetching sponsorships:", error);
      res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Fetch sponsorship requests for a sponsor
router.get("/requests", authMiddleware, async (req, res) => {
  try {
    const requests = await Sponsorship.find({ sponsor: req.user.id }).populate("athlete", "name email");
    res.json(requests);
  } catch (error) {
    console.error("🔥 Error fetching sponsorship requests:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ✅ Approve/Reject a sponsorship request
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status update" });
    }

    const application = await Sponsorship.findById(req.params.id);
    if (!application) return res.status(404).json({ msg: "Application not found" });

    if (application.sponsor.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized to update this sponsorship" });
    }

    application.status = status;
    await application.save();

    res.json({ msg: `Sponsorship ${status} successfully`, application });
  } catch (error) {
    console.error("🔥 Error updating sponsorship:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ✅ Fetch sponsorship requests for logged-in sponsor
router.get("/requests", authMiddleware, async (req, res) => {
  try {
    const sponsorId = req.user.id;

    const requests = await Sponsorship.find({ sponsor: sponsorId })
      .populate("athlete", "name email")
      .select("amountRequested status");

    res.json(requests);
  } catch (error) {
    console.error("🔥 Error fetching sponsorship requests:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Update sponsorship request status
router.put("/requests/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const sponsorship = await Sponsorship.findById(req.params.id);
    if (!sponsorship) return res.status(404).json({ msg: "Request not found" });

    if (sponsorship.sponsor.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to update this request" });
    }

    sponsorship.status = status;
    await sponsorship.save();

    res.json({ msg: `Sponsorship request ${status}` });
  } catch (error) {
    console.error("🔥 Error updating sponsorship request:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Fetch All Sponsors (Users with role "Sponsor")
router.get("/admin/sponsors", authMiddleware, async (req, res) => {
  try {
    const sponsors = await User.find({ role: "Sponsor" }).select("_id name email image company phone");
    res.json(sponsors);
  } catch (error) {
    console.error("🔥 Error fetching sponsors:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ✅ Delete Sponsor (Only if they exist as a User)
router.delete("/admin/sponsors/:id", authMiddleware, async (req, res) => {
  try {
    console.log("🗑 Delete request for sponsor:", req.params.id);

    const sponsor = await User.findById(req.params.id);
    if (!sponsor || sponsor.role !== "Sponsor") {
      return res.status(404).json({ msg: "Sponsor not found." });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "Sponsor deleted successfully." });
  } catch (error) {
    console.error("🔥 Error deleting sponsor:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;


module.exports = router;
