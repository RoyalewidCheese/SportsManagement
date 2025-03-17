const express = require("express");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const Institution = require("../models/Institution");
const path = require("path");

const router = express.Router();

// 🖼️ Multer Setup for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Register an Institution
router.post("/register", async (req, res) => {
  try {
    const { name, location } = req.body;

    const institution = new Institution({
      name,
      location,
    });

    await institution.save();
    res.status(201).json({ msg: "Institution registered successfully", institution });
  } catch (error) {
    console.error("🔥 Error registering institution:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// // ✅ Fetch Monitoring Data for Institution
// router.get("/monitor", authMiddleware, async (req, res) => {
//   try {
//     // Ensure the logged-in user is an institution
//     const institution = await User.findOne({ _id: req.user.id, role: "Institution" });
    
//     if (!institution) {
//       return res.status(403).json({ msg: "Access denied. Only institutions can monitor athletes." });
//     }

//     // Fetch athletes under this institution
//     const athletes = await User.find({ instituteId: institution._id, role: "Athlete" }).select("_id name email admissionNumber image");

//     if (athletes.length === 0) {
//       return res.status(404).json({ msg: "No registered athletes found under this institution." });
//     }

//     // Fetch tournament participation for these athletes
//     const athleteIds = athletes.map(athlete => athlete._id);
//     const participations = await Application.find({ athlete: { $in: athleteIds } })
//       .populate("athlete", "name email admissionNumber image")
//       .populate("tournament", "name location date");

//     res.json(participations);
//   } catch (error) {
//     console.error("🔥 Error fetching monitoring data:", error);
//     res.status(500).json({ msg: "Server error", error: error.message });
//   }
// });


// ✅ Fetch All Institutions
router.get("/institutions", async (req, res) => {
  try {
    const institutions = await Institution.find({});
    res.json(institutions);
  } catch (error) {
    res.status(500).json({ msg: "🔥 Error fetching institutions", error: error.message });
  }
});

// ✅ Fetch Single Institution by ID
router.get("/institutions/:id", async (req, res) => {
  try {
    const institution = await Institution.findById(req.params.id);
    if (!institution) return res.status(404).json({ msg: "Institution not found" });

    res.json(institution);
  } catch (error) {
    res.status(500).json({ msg: "🔥 Error fetching institution", error: error.message });
  }
});

// ✅ Fetch Athletes by Institution ID
router.get("/institutions/:id/athletes", async (req, res) => {
  try {
    const institutionId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(institutionId)) {
      return res.status(400).json({ msg: "Invalid Institution ID" });
    }

    const institution = await Institution.findById(institutionId);
    if (!institution) {
      return res.status(404).json({ msg: "Institution not found" });
    }

    const athletes = await User.find({ instituteId: institutionId, role: "Athlete" });
    res.json(athletes);
  } catch (error) {
    console.error("🔥 Error fetching athletes:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ✅ Fetch All Institutions for Admin
router.get("/admin/institutions", authMiddleware, async (req, res) => {
  try {
    console.log("📡 Admin fetching institutions...");
    const institutions = await Institution.find();
    res.json(institutions);
  } catch (error) {
    console.error("🔥 Error fetching institutions:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.post("/institution/register-athlete", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { name, email, password, admissionNumber } = req.body;

    // Extract instituteId from the JWT token
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const instituteId = decoded.user.instituteId;

    if (!mongoose.Types.ObjectId.isValid(instituteId)) {
      return res.status(400).json({ msg: "Invalid Institution ID" });
    }

    // Ensure the institution exists
    const institution = await Institution.findById(instituteId);
    if (!institution) {
      return res.status(404).json({ msg: "Institution not found" });
    }

    let athlete = await User.findOne({ email });
    if (athlete) {
      return res.status(400).json({ msg: "Athlete already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    athlete = new User({
      name,
      email,
      password: hashedPassword,
      role: "Athlete",
      instituteId,
      admissionNumber,
      image: imageUrl,
    });

    await athlete.save();
    res.status(201).json({ msg: "Athlete registered successfully", athlete });
  } catch (error) {
    console.error("🔥 Error registering athlete:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.put("/institutions/athletes/:id", authMiddleware, async (req, res) => {
  try {
    console.log("🔄 Update request for athlete:", req.params.id);

    const athlete = await User.findById(req.params.id);
    if (!athlete) {
      return res.status(404).json({ msg: "Athlete not found." });
    }

    Object.assign(athlete, req.body);
    await athlete.save();

    res.json({ msg: "Athlete updated successfully.", athlete });
  } catch (error) {
    console.error("🔥 Error updating athlete:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

router.delete("/institutions/athletes/:id", authMiddleware, async (req, res) => {
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

// ✅ Admin - Fetch All Institutions
router.get("/admin/institutions", authMiddleware, async (req, res) => {
  try {
    const institutions = await Institution.find({});
    res.json(institutions);
  } catch (error) {
    res.status(500).json({ msg: "🔥 Error fetching institutions", error: error.message });
  }
});

// ✅ Admin - Fetch Single Institution by ID
router.get("/admin/institutions/:id", authMiddleware, async (req, res) => {
  try {
    const institution = await Institution.findById(req.params.id);
    if (!institution) return res.status(404).json({ msg: "Institution not found" });

    res.json(institution);
  } catch (error) {
    res.status(500).json({ msg: "🔥 Error fetching institution", error: error.message });
  }
});

// ✅ Admin - Create Institution
router.post("/admin/institutions", authMiddleware, async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!name || !location) {
      return res.status(400).json({ msg: "Name and location are required." });
    }

    const institution = new Institution({ name, location });
    await institution.save();
    res.status(201).json({ msg: "Institution created successfully", institution });
  } catch (error) {
    res.status(500).json({ msg: "🔥 Error creating institution", error: error.message });
  }
});

// ✅ Admin - Update Institution
router.put("/admin/institutions/:id", authMiddleware, async (req, res) => {
  try {
    const { name, location } = req.body;
    const updatedInstitution = await Institution.findByIdAndUpdate(
      req.params.id,
      { name, location },
      { new: true }
    );

    if (!updatedInstitution) {
      return res.status(404).json({ msg: "Institution not found" });
    }

    res.json({ msg: "Institution updated successfully", updatedInstitution });
  } catch (error) {
    res.status(500).json({ msg: "🔥 Error updating institution", error: error.message });
  }
});

// ✅ Admin - Delete Institution
router.delete("/admin/institutions/:id", authMiddleware, async (req, res) => {
  try {
    const deletedInstitution = await Institution.findByIdAndDelete(req.params.id);
    if (!deletedInstitution) {
      return res.status(404).json({ msg: "Institution not found" });
    }

    res.json({ msg: "Institution deleted successfully." });
  } catch (error) {
    res.status(500).json({ msg: "🔥 Error deleting institution", error: error.message });
  }
});




module.exports = router;
