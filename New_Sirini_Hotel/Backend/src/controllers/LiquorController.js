const Liquor = require("../models/Liquor");
const cloudinary = require("cloudinary");

const addLiquor = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      alcoholPercentage,
      description,
      volume,
      origin,
      brand,
    } = req.body;

    // 1. Validation check for body fields
    if (!name || !price || !category) {
      return res
        .status(400)
        .json({ message: "Name, Price, and Category are required" });
    }

    // 2. SAFETY CHECK: Ensure req.file exists before accessing properties
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    // Note: If using cloudinary-multer, the path is usually req.file.path or req.file.secure_url
    const image = req.file.path || req.file.secure_url;
    const imagePublicId = req.file.filename || req.file.public_id;

    const newLiquor = new Liquor({
      name,
      price,
      category,
      alcoholPercentage,
      image,
      imagePublicId,
      description,
      volume,
      origin,
      brand,
      isAvailable: true,
    });

    await newLiquor.save();
    res.status(201).json(newLiquor);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding liquor", error: error.message });
  }
};

const getAllLiquor = async (req, res) => {
  try {
    const liquor = await Liquor.find().sort({ createdAt: -1 });
    if (liquor.length === 0) {
      return res.status(404).json({ message: "No liquor found" });
    }
    res.status(200).json(liquor);
  } catch (error) {
    console.error("DETAILED BACKEND ERROR:", error);
    res
      .status(500)
      .json({ message: "Error fetching liquor", error: error.message });
  }
};

const deleteLiquor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Liquor ID is required" });
    }
    const liquor = await Liquor.findById(id);
    if (!liquor) {
      return res.status(404).json({ message: "Liquor not found" });
    }
    if (liquor.imagePublicId) {
      try {
        await cloudinary.v2.uploader.destroy(liquor.imagePublicId);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }
    await Liquor.findByIdAndDelete(id);
    res.status(200).json({ message: "Liquor deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting liquor", error: error.message });
  }
};

const updateLiquor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Liquor ID is required" });
    }
    const updates = req.body;

    const existingLiquor = await Liquor.findById(id);
    if (!existingLiquor) {
      return res.status(404).json({ message: "Liquor not found" });
    }

    if (req.file) {
      if (existingLiquor.imagePublicId) {
        await cloudinary.v2.uploader.destroy(existingLiquor.imagePublicId);
      }
      updates.image = req.file.secure_url;
      updates.imagePublicId = req.file.public_id;
    }

    const updatedLiquor = await Liquor.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,
      },
    );
    if (!updatedLiquor) {
      return res.status(404).json({ message: "Liquor not found" });
    }
    res.status(200).json(updatedLiquor);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating liquor", error: error.message });
  }
};
const toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Liquor ID is required" });
    }
    const liquor = await Liquor.findById(id);
    if (!liquor) {
      return res.status(404).json({ message: "Liquor not found" });
    }
    liquor.isAvailable = !liquor.isAvailable;
    await liquor.save();
    res.status(200).json(liquor);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error toggling availability", error: error.message });
  }
};

module.exports = {
  addLiquor,
  getAllLiquor,
  deleteLiquor,
  updateLiquor,
  toggleAvailability,
};
