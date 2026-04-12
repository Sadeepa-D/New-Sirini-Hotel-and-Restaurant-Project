const Adevertisment = require("../../models/Reception/AdvertisingModel");

const createAdvertisment = async (req, res) => {
  try {
    const userId = req.userData.id;
    const {
      BuissnesName,
      category,
      description,
      portfolio,
      price,
      location,
      TPNumber,
    } = req.body;
    if (
      !BuissnesName ||
      !category ||
      !description ||
      !price ||
      !location ||
      !TPNumber
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const image = req.file ? req.file.secure_url : null;
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }
    const newAdvertisment = new Adevertisment({
      userId,
      BuissnesName,
      category,
      description,
      image,
      portfolio,
      price,
      location,
      TPNumber,
      status: "pending",
    });
    await newAdvertisment.save();
    res.status(201).json({
      message: "Advertisment created successfully",
    });
  } catch (error) {
    console.error("Error creating advertisment:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getAdvertisments = async (req, res) => {
  try {
    const advertisments = await Adevertisment.find();
    if (advertisments.length === 0) {
      return res.status(404).json({ message: "No advertisments found" });
    }
    res.status(200).json(advertisments);
  } catch (error) {
    console.error("Error fetching advertisments:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const deleteAdvertisment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Advertisment ID is required" });
    }
    const deletedAdvertisment = await Adevertisment.findByIdAndDelete(id);
    if (!deletedAdvertisment) {
      return res.status(404).json({ message: "Advertisment not found" });
    }
    res.status(200).json({ message: "Advertisment deleted successfully" });
  } catch (error) {
    console.error("Error deleting advertisment:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const updateAdvertisment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Advertisment ID is required" });
    }
    const updateData = req.body;
    if (req.file) {
      updateData.image = req.file.path;
    }
    const updatedAdvertisment = await Adevertisment.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );
    if (!updatedAdvertisment) {
      return res.status(404).json({ message: "Advertisment not found" });
    }
    res.status(200).json({
      message: "Advertisment updated successfully",
    });
  } catch (error) {
    console.error("Error updating advertisment:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const toggleAdvertismentStatustoApproved = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Advertisment ID is required" });
    }
    const updatedAdvertisment = await Adevertisment.findByIdAndUpdate(
      id,
      { $set: { status: "approved" } },
      { new: true },
    );
    if (!updatedAdvertisment) {
      return res.status(404).json({ message: "Advertisment not found" });
    }
    res.status(200).json({
      message: "Advertisment status updated to approved",
    });
  } catch (error) {
    console.error("Error updating advertisment status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const toggleAdvertismentStatustoRejected = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Advertisment ID is required" });
    }
    const updatedAdvertisment = await Adevertisment.findByIdAndUpdate(
      id,
      { $set: { status: "rejected" } },
      { new: true },
    );
    if (!updatedAdvertisment) {
      return res.status(404).json({ message: "Advertisment not found" });
    }
    res.status(200).json({
      message: "Advertisment status updated to rejected",
    });
  } catch (error) {
    console.error("Error updating advertisment status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getPendingAdvertisments = async (req, res) => {
  try {
    const pendingAdvertisments = await Adevertisment.find({
      status: "pending",
    });
    if (pendingAdvertisments.length === 0) {
      return res
        .status(404)
        .json({ message: "No pending advertisments found" });
    }
    res.status(200).json(pendingAdvertisments);
  } catch (error) {
    console.error("Error fetching pending advertisments:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getApprovedAdvertisments = async (req, res) => {
  try {
    const approvedAdvertisments = await Adevertisment.find({
      status: "approved",
    });
    if (approvedAdvertisments.length === 0) {
      return res
        .status(404)
        .json({ message: "No approved advertisments found" });
    }
    res.status(200).json(approvedAdvertisments);
  } catch (error) {
    console.error("Error fetching approved advertisments:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getRejectedAdvertisments = async (req, res) => {
  try {
    const rejectedAdvertisments = await Adevertisment.find({
      status: "rejected",
    });
    if (rejectedAdvertisments.length === 0) {
      return res
        .status(404)
        .json({ message: "No rejected advertisments found" });
    }
    res.status(200).json(rejectedAdvertisments);
  } catch (error) {
    console.error("Error fetching rejected advertisments:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  createAdvertisment,
  getAdvertisments,
  deleteAdvertisment,
  updateAdvertisment,
  toggleAdvertismentStatustoApproved,
  toggleAdvertismentStatustoRejected,
  getPendingAdvertisments,
  getApprovedAdvertisments,
  getRejectedAdvertisments,
};
