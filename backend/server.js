const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

// Importing Routes
const authRoutes = require("./routes/authRoutes");
const tournamentRoutes = require("./routes/tournament");
const athleteRoutes = require("./routes/athlete");
const sponsorRoutes = require("./routes/sponsor");
const feedbackRoutes = require("./routes/feedback");
const councilRoutes = require("./routes/councilRoutes");
const winnerRoutes = require("./routes/winnerRoutes");
const userRoutes = require("./routes/userRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const institutionRoutes = require("./routes/institutionRoutes");
const monitorRoutes = require("./routes/monitoringRoutes");
const adminTournamentRoutes = require("./routes/adminTournamentRoutes");

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/athletes", athleteRoutes);
app.use("/api/sponsors", sponsorRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/council", councilRoutes);
app.use("/api/winners", winnerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/", institutionRoutes);
app.use("/api/monitor", monitorRoutes);
app.use("/api/admin/tournaments", adminTournamentRoutes);


// Root Route
app.get("/", (req, res) => res.send("Sports Council API is running..."));

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));