const CateringItems = require("../../models/Reception/CateringItems");
const cloudinary = require("cloudinary");

const createCateringItem = async (req, res) => {
  try {
    const { name, ingredients, priceperserving } = req.body;
    if (!name || !ingredients || !priceperserving) {
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
      priceperserving,
      image,
      imagePublicId,
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
      updates.image = req.file.secure_url; // New URL
      updates.imagePublicId = req.file.public_id; // New Public ID
    }
    const updatedItem = await CateringItems.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true },
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Catering item not found" });
    }
    res.status(201).json({ message: "Catering item updated successfully" });
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
        // Continue with database deletion even if Cloudinary deletion fails
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

module.exports = {
  createCateringItem,
  getCateringItems,
  updateCateringItem,
  deleteCateringItem,
  toggleCateringItemAvailability,
};
