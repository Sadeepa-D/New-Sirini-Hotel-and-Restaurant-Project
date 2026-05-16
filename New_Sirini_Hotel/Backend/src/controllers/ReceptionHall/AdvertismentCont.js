const Adevertisment = require("../../models/Reception/AdvertisingModel");
const cloudinary = require("cloudinary");

const createAdvertisment = async (req, res) => {
  try {
    const userId = req.userData.id;
    const {
      BuissnesName,
      BuissnessOwnerName,
      NIC,
      category,
      description,
      portfolio,
      price,
      location,
      TPNumber,
    } = req.body;
    if (
      !BuissnesName ||
      !BuissnessOwnerName ||
      !NIC ||
      !category ||
      !description ||
      !price ||
      !location ||
      !TPNumber
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const image = req.file ? req.file.secure_url : null;
    const imagePublicId = req.file ? req.file.public_id : null;
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }
    const newAdvertisment = new Adevertisment({
      userId,
      BuissnesName,
      BuissnessOwnerName,
      NIC,
      category,
      description,
      image,
      imagePublicId,
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
    const advertisment = await Adevertisment.findById(id);
    if (!advertisment) {
      return res.status(404).json({ message: "Advertisment not found" });
    }
    if (advertisment.imagePublicId) {
      try {
        await cloudinary.v2.uploader.destroy(advertisment.imagePublicId);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
      }
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

    const existingAdvertisment = await Adevertisment.findById(id);
    if (!existingAdvertisment) {
      return res.status(404).json({ message: "Advertisment not found" });
    }

    if (req.file) {
      if (existingAdvertisment.imagePublicId) {
        await cloudinary.v2.uploader.destroy(
          existingAdvertisment.imagePublicId,
        );
      }
      updateData.image = req.file.secure_url;
      updateData.imagePublicId = req.file.public_id;
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
      advertisment: updatedAdvertisment,
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
      advertisment: updatedAdvertisment,
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
      advertisment: updatedAdvertisment,
    });
  } catch (error) {
    console.error("Error updating advertisment status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const toggleAdvertismentStatustoPending = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Advertisment ID is required" });
    }
    const updatedAdvertisment = await Adevertisment.findByIdAndUpdate(
      id,
      { $set: { status: "pending" } },
      { new: true },
    );
    if (!updatedAdvertisment) {
      return res.status(404).json({ message: "Advertisment not found" });
    }
    res.status(200).json({
      message: "Advertisment status updated to pending",
      advertisment: updatedAdvertisment,
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
    res.status(200).json(rejectedAdvertisments);
  } catch (error) {
    console.error("Error fetching rejected advertisments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getSpecificUserAdvertisments = async (req, res) => {
  try {
    const userId = req.userData.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const userAdvertisments = await Adevertisment.find({ userId });
    res.status(200).json(userAdvertisments);
  } catch (error) {
    console.error("Error fetching user advertisments:", error);
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
  toggleAdvertismentStatustoPending,
  getPendingAdvertisments,
  getApprovedAdvertisments,
  getRejectedAdvertisments,
  getSpecificUserAdvertisments,
};
