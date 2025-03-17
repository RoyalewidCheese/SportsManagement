const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        if (!name || !email || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            image: imagePath, // Save image path in the database
        });

        await newUser.save();
        res.status(201).json({ msg: "User registered successfully", user: newUser });
    } catch (error) {
        console.error("🔥 Registration Error:", error.message);
        res.status(500).json({ msg: "Server error" });
    }
};

const User = require("../models/User");

const getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password from response
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = { getLoggedInUser };