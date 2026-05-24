const Feedback = require("../models/FeedbackModel");
const Room = require("../models/Rooms/RoomModel");

// @POST /api/feedback/add
const addFeedback = async (req, res) => {
  try {
    const { roomId, roomNumber, userName, rating, comment, bookingId } =
      req.body;
    const userId = req.userData?.id;

    // Validation
    if (!userId) {
      return res.status(401).json({ message: "User authentication failed" });
    }
    if (
      !roomId ||
      !roomNumber ||
      !userName ||
      !rating ||
      !comment ||
      !bookingId
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }
    if (comment.length < 10 || comment.length > 500) {
      return res.status(400).json({
        message: "Comment must be between 10 and 500 characters",
      });
    }

    // Check if user already left feedback for this booking
    const existingFeedback = await Feedback.findOne({ bookingId });
    if (existingFeedback) {
      return res
        .status(400)
        .json({ message: "You have already left feedback for this booking" });
    }

    // Create new feedback
    const newFeedback = await Feedback.create({
      userId,
      roomId,
      roomNumber,
      userName,
      rating,
      comment,
      bookingId,
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback: newFeedback,
    });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// @GET /api/feedback/room/:roomNumber
const getRoomAverageRating = async (req, res) => {
  try {
    const { roomNumber } = req.params;

    const feedbacks = await Feedback.find({ roomNumber });

    if (feedbacks.length === 0) {
      return res.status(200).json({
        roomNumber,
        averageRating: 0,
        totalReviews: 0,
        ratingBreakdown: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
      });
    }

    // Calculate average rating
    const totalRating = feedbacks.reduce((sum, f) => sum + f.rating, 0);
    const averageRating = (totalRating / feedbacks.length).toFixed(1);

    // Calculate rating breakdown
    const ratingBreakdown = {
      5: feedbacks.filter((f) => f.rating === 5).length,
      4: feedbacks.filter((f) => f.rating === 4).length,
      3: feedbacks.filter((f) => f.rating === 3).length,
      2: feedbacks.filter((f) => f.rating === 2).length,
      1: feedbacks.filter((f) => f.rating === 1).length,
    };

    res.status(200).json({
      roomNumber,
      averageRating: parseFloat(averageRating),
      totalReviews: feedbacks.length,
      ratingBreakdown,
    });
  } catch (error) {
    console.error("Error fetching room rating:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// @GET /api/feedback/all
const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(20); // Limit to 20 most recent feedbacks

    if (feedbacks.length === 0) {
      return res.status(200).json({
        message: "No feedbacks found",
        feedbacks: [],
      });
    }

    // Format feedback for frontend
    const formattedFeedbacks = feedbacks.map((feedback) => ({
      _id: feedback._id,
      userName: feedback.userName,
      rating: feedback.rating,
      comment: feedback.comment,
      roomNumber: feedback.roomNumber,
      createdAt: feedback.createdAt,
      timestamp: new Date(feedback.createdAt).toLocaleDateString("en-GB"),
    }));

    res.status(200).json({
      message: "Feedbacks fetched successfully",
      feedbacks: formattedFeedbacks,
      total: formattedFeedbacks.length,
    });
  } catch (error) {
    console.error("Error fetching all feedbacks:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// @GET /api/feedback/room/:roomNumber/reviews
const getRoomFeedbacks = async (req, res) => {
  try {
    const { roomNumber } = req.params;

    const feedbacks = await Feedback.find({ roomNumber })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      roomNumber,
      feedbacks: feedbacks.map((f) => ({
        _id: f._id,
        userName: f.userName,
        rating: f.rating,
        comment: f.comment,
        createdAt: f.createdAt,
        timestamp: new Date(f.createdAt).toLocaleDateString("en-GB"),
      })),
      total: feedbacks.length,
    });
  } catch (error) {
    console.error("Error fetching room feedbacks:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  addFeedback,
  getRoomAverageRating,
  getAllFeedback,
  getRoomFeedbacks,
};
