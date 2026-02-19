const Liquor = require("../models/Liquor");

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

    const image = req.file ? req.file.path : null;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newLiquor = new Liquor({
      name,
      price,
      category,
      alcoholPercentage,
      image,
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
    res.status(200).json(liquor);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching liquor", error: error.message });
  }
};

const deleteLiquor = async (req, res) => {
  try {
    const { id } = req.params;
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
    const updates = req.body;

    if (req.file) {
      updates.image = req.file.path;
    }

    const updatedLiquor = await Liquor.findByIdAndUpdate(id, updates, {
      new: true,
    });

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
