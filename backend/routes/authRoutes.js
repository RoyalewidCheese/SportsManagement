const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const multer = require("multer");
const mongoose = require("mongoose");
const User = require("../models/User");
const Institution = require("../models/Institution");
const router = express.Router();
const { getLoggedInUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");
require("dotenv").config();

// ✅ Configure Multer for File Storage
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// ✅ Fetch Logged-in User
router.get("/me", authMiddleware, getLoggedInUser);

// ✅ Refresh Token
router.post("/refresh", (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ msg: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const newToken = jwt.sign({ user: decoded.user }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token: newToken });
    } catch (error) {
        res.status(401).json({ msg: "Invalid token" });
    }
});

// ✅ Register User (With Password Hashing & Image Upload)
router.post("/register", upload.single("image"), [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    check("role", "Role is required").not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, location } = req.body; 
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // ✅ Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let instituteId = null;

        // ✅ If registering an institution, create an institution record
        if (role === "Institution") {
            const institutionId = new mongoose.Types.ObjectId(); // Generate institution ID

            const newInstitution = new Institution({
                _id: institutionId,
                name,
                location,
            });

            await newInstitution.save();
            instituteId = institutionId; // ✅ Assign institution's own ID
        }

        // ✅ Create and Save User (with instituteId if applicable)
        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            image: imagePath,
            instituteId, // ✅ Assign own ID for institutions
        });

        await user.save();

        // ✅ Generate JWT Token
        const payload = { 
            user: { id: user.id, role: user.role, instituteId: user.instituteId || null } 
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ token, user });

    } catch (error) {
        console.error("🔥 Registration Error:", error.message);
        res.status(500).send("Server error");
    }
});


// ✅ Login User (With bcrypt Password Comparison)
router.post("/login", [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log("🔹 Login attempt:", email, "with password:", password);

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found:", email);
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        console.log("✅ User found:", user.email, "Role:", user.role);
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Incorrect password for:", email);
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // ✅ Ensure `instituteId` is included
        console.log("🏫 Institution ID for user:", user.instituteId);

        const payload = {
            user: {
                id: user.id,
                role: user.role,
                instituteId: user.instituteId || null,  // Ensure this is included
            },
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log("🔑 JWT Generated:", token);
        res.json({ token });

    } catch (error) {
        console.error("🔥 Login error:", error.message);
        res.status(500).send("Server error");
    }
});


module.exports = router;
