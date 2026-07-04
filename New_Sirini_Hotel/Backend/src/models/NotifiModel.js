const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  bookingId: { type: mongoose.Schema.Types.ObjectId, default: null },
  roomNumber: { type: String, default: null },
  hasFeedback: { type: Boolean, default: false },
});

module.exports = mongoose.model("Notification", NotificationSchema);
