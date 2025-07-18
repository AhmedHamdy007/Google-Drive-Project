const express = require("express");
const cors = require("cors");
const connectDB = require("./db"); // Import connectDB function
require("dotenv").config();
const taskRoutes = require("./routes/tasks");
const timetableRoutes = require("./routes/timetable");
const sharedLinksRoutes = require("./routes/sharedLinks"); // SharedLinks routes
const userRoutes = require("./routes/userRoutes");
const categorySessionRoutes = require('./routes/categorySession');
const adminStatsRoutes = require("./routes/adminStats"); // Import admin stats route

const app = express();
const port = 5000;

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Connect to the database
connectDB();

// Routes
app.use(require("./routes/auth"));
app.use(require("./routes/userSubjects"));
app.use(require("./routes/lecturerCourses"));

app.use("/users", require("./routes/users"));
app.use("/api/tasks", taskRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/shared-links", sharedLinksRoutes);
app.use("/api", userRoutes);
app.use('/api/categories-sessions', categorySessionRoutes);
app.use("/api/admin", adminStatsRoutes); // Admin route

// Default route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});
// Start server
app.listen(port, () => {
  console.log(process.env.MONGO_URI);
  console.log(`Server running at http://localhost:${port}`);
});
