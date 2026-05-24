const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const connectDB = require("./config/mongoconnection");
const RoomRoutes = require("./routes/RoomsRoutes");
const LiquorRoutes = require("./routes/LiquorRoutes");
const UserRoutes = require("./routes/UserRoute");
const RestrauntRoutes = require("./routes/RestrauntRoutes");
const ReceptionHallRoutes = require("./routes/ReceptionHallRoutes");
const GalleryRoutes = require("./routes/GalleryRoutes");
const FeedbackRoutes = require("./routes/FeedbackRoutes");
const { initCronJobs } = require("./services/cronService");
const { apiLimiter } = require("./middleware/RateLimiter");

connectDB();
initCronJobs();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/users", UserRoutes);
app.use("/api/liquor", LiquorRoutes);
app.use("/api/rooms", RoomRoutes);
app.use("/api/restraunt", RestrauntRoutes);
app.use("/api/receptionhall", ReceptionHallRoutes);
app.use("/api/gallery", GalleryRoutes);
app.use("/api/feedback", FeedbackRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
