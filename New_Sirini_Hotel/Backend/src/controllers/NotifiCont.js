const NotifiModel = require("../models/NotifiModel");

const getNotifications = async (req, res) => {
  const userId = req.userData.id;
  try {
    const notifications = await NotifiModel.find({ userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(notifications || []);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const markAsRead = async (req, res) => {
  const { notificationId } = req.body;
  try {
    if (!notificationId) {
      return res.status(400).json({ message: "Notification ID is required" });
    }
    await NotifiModel.findByIdAndUpdate(notificationId, { isRead: true });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  const userId = req.userData.id;
  try {
    await NotifiModel.updateMany({ userId, isRead: false }, { isRead: true });
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const clearallNotifications = async (req, res) => {
  try {
    const userId = req.userData.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    await NotifiModel.deleteMany({ userId });
    res.status(200).json({ message: "All notifications cleared" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearallNotifications,
};
