const CateringItems = require("../../models/Reception/CateringItems");
const cloudinary = require("cloudinary");

const createCateringItem = async (req, res) => {
  try {
    const { name, ingredients, price } = req.body;
    if (!name || !ingredients || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const image = req.file ? req.file.secure_url : null;
    const imagePublicId = req.file ? req.file.public_id : null;
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newCateringItem = new CateringItems({
      name,
      ingredients,
      price,
      image,
      imagePublicId,
      status: true,
    });
    await newCateringItem.save();
    res.status(201).json(newCateringItem);
  } catch (error) {
    res.status(500).json({ message: "Error creating catering item", error });
  }
};
const getCateringItems = async (req, res) => {
  try {
    const items = await CateringItems.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching catering items", error });
  }
};
const updateCateringItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Catering item ID is required" });
    }
    const updates = req.body;

    const existingItem = await CateringItems.findById(id);
    if (!existingItem) {
      return res.status(404).json({ message: "Catering item not found" });
    }

    if (req.file) {
      if (existingItem.imagePublicId) {
        await cloudinary.v2.uploader.destroy(existingItem.imagePublicId);
      }
      updates.image = req.file.secure_url;
      updates.imagePublicId = req.file.public_id;
    }
    const updatedItem = await CateringItems.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true },
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Catering item not found" });
    }
    res.status(201).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating catering item", error });
  }
};
const deleteCateringItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Catering item ID is required" });
    }
    const item = await CateringItems.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Catering item not found" });
    }
    if (item.imagePublicId) {
      try {
        await cloudinary.v2.uploader.destroy(item.imagePublicId);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
      }
    }
    const deletedItem = await CateringItems.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Catering item not found" });
    }
    res.status(200).json({ message: "Catering item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting catering item", error });
  }
};
const toggleCateringItemAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Catering item ID is required" });
    }
    const item = await CateringItems.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Catering item not found" });
    }
    item.status = !item.status;
    const updatedItem = await item.save();
    res.status(200).json(updatedItem);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error toggling catering item availability", error });
  }
};
module.exports = {
  createCateringItem,
  getCateringItems,
  updateCateringItem,
  deleteCateringItem,
  toggleCateringItemAvailability,
};
