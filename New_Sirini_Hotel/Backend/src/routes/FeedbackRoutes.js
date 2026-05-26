const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/AuthMiddleware");
const RoleBaseMiddleware = require("../middleware/RoleBaseMiddleware");
const FeedbackController = require("../controllers/FeedbackCont");

// Protected route - user must be logged in to submit feedback
router.post("/add", authMiddleware, FeedbackController.addFeedback);

// Delete feedback - Admin only
router.delete(
  "/:feedbackId",
  authMiddleware,
  RoleBaseMiddleware(["Admin"]),
  FeedbackController.deleteFeedback,
);

// Public routes - anyone can view feedback
router.get("/room/:roomNumber", FeedbackController.getRoomAverageRating);

router.get("/room/:roomNumber/reviews", FeedbackController.getRoomFeedbacks);

router.get("/all", FeedbackController.getAllFeedback);

module.exports = router;
