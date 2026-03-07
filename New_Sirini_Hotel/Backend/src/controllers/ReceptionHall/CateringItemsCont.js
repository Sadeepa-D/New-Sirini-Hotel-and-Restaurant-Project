const CateringItems = require("../../models/Reception/CateringItems");

const createCateringItem = async (req, res) => {
  try {
    const { name, ingredients, priceperserving } = req.body;
    if (!name || !ingredients || !priceperserving) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const image = req.file ? req.file.path : null;
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }
    const newCateringItem = new CateringItems({
      name,
      ingredients,
      priceperserving,
      image,
      status: true,
    });
    await newCateringItem.save();
    res.status(201).json({
      message: "Catering item created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating catering item", error });
  }
};
const getCateringItems = async (req, res) => {
  try {
    const items = await CateringItems.find();
    if (items.length === 0) {
      return res.status(404).json({ message: "No catering items found" });
    }
    res.status(200).json({ items });
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
    if (req.file) {
      updates.image = req.file.path;
    }
    const updatedItem = await CateringItems.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true },
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Catering item not found" });
    }
    res.status(200).json({ message: "Catering item updated successfully" });
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
    await item.save();
    res
      .status(200)
      .json({ message: "Catering item availability toggled successfully" });
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
