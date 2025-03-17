const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
    const token = req.header("Authorization"); // ✅ Correctly retrieve token

    if (!token) {
        return res.status(401).json({ msg: "No token provided. Authorization denied." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ msg: "Invalid token. Please log in again." });
    }
};