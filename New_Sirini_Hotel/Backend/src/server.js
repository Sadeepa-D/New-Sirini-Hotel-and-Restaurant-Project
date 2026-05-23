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
app.use("/api/liquor",apiLimiter, LiquorRoutes);
app.use("/api/rooms",apiLimiter, RoomRoutes);
app.use("/api/restraunt", apiLimiter, RestrauntRoutes);
app.use("/api/receptionhall", apiLimiter, ReceptionHallRoutes);
app.use("/api/gallery", apiLimiter, GalleryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
