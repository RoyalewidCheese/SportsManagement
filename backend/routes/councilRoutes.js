const express = require("express");
const router = express.Router();
const Council = require("../models/Council");
const auth = require("../middleware/auth")
const User = require("../models/User");

// ✅ GET all Council Members
router.get("/", async (req, res) => {
  try {
    const members = await Council.find();
    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching council members:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ PUT all Council Members
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMember = await Council.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedMember) {
      return res.status(404).json({ error: "Council Member Not Found" });
    }

    res.status(200).json(updatedMember);
  } catch (error) {
    console.error("Error updating member:", error);
    res.status(500).json({ error: "Server Error" });
  }
});


// ✅ Fetch All Sports Councils (Admin View)
router.get("/admin/sports-councils", auth, async (req, res) => {
  try {
    console.log("🔹 Fetching sports councils...");
    
    if (req.user.role !== "Admin") {
      return res.status(403).json({ msg: "Access denied. Admins only." });
    }

    // Fetch councils and include image field
    const councils = await User.find({ role: "SportsCouncil" })
      .select("_id name email image");

    // ✅ Convert image path to full URL
    const formattedCouncils = councils.map((council) => ({
      ...council._doc,
      image: council.image ? `http://localhost:8000${council.image}` : "/default-profile.png",
    }));

    res.json(formattedCouncils);
  } catch (error) {
    console.error("🔥 Error fetching sports councils:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});



// ✅ DELETE Council Member
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const deletedMember = await Council.findByIdAndDelete(id);
    if (!deletedMember) {
      return res.status(404).json({ error: "Council Member Not Found" });
    }

    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Update a Sports Council (Admin Access)
router.put("/admin/sports-councils/:id", auth, async (req, res) => {
  try {
    console.log("📝 Update request for council:", req.params.id);

    // Ensure only Admins can update
    if (req.user.role !== "Admin") {
      return res.status(403).json({ msg: "Access denied. Admins only." });
    }

    const council = await User.findById(req.params.id);
    if (!council || council.role !== "SportsCouncil") {
      return res.status(404).json({ msg: "Sports Council not found." });
    }

    Object.assign(council, req.body);
    await council.save();

    res.json({ msg: "Sports Council updated successfully.", council });
  } catch (error) {
    console.error("🔥 Error updating sports council:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ✅ Delete a Sports Council (Admin Access)
router.delete("/admin/sports-councils/:id", auth, async (req, res) => {
  try {
    console.log("🗑 Delete request for council:", req.params.id);

    // Ensure only Admins can delete
    if (req.user.role !== "Admin") {
      return res.status(403).json({ msg: "Access denied. Admins only." });
    }

    const council = await User.findById(req.params.id);
    if (!council || council.role !== "SportsCouncil") {
      return res.status(404).json({ msg: "Sports Council not found." });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "Sports Council deleted successfully." });
  } catch (error) {
    console.error("🔥 Error deleting sports council:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});


module.exports = router;