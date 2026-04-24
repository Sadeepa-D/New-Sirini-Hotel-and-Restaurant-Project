const FoodItems = require("../../models/Restraunt/FoodItemModel");
const cloudinary = require("cloudinary");

const createFoodItem = async (req, res) => {
  try {
    const { name, price, description, category, portion, dietary, preparationTime } = req.body;
    if (!name || !price || !description || !category) {
      return res.status(400).json({ message: "Required fields are missing" });
    }
    const image = req.file ? req.file.secure_url : null;
    const imagePublicId = req.file ? req.file.public_id : null;
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }
    const newFoodItem = new FoodItems({
      foodname: name,
      price,
      description,
      ingredients: ["Not specified"],
      category,
      portion,
      dietary,
      preparationTime,
      image,
      imagePublicId,
      availability: true,
    });
    await newFoodItem.save();
    res.status(201).json(newFoodItem);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating food item", error: error.message });
  }
};
const getFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItems.find();
    if (foodItems.length === 0) {
      return res.status(404).json({ message: "No food items found" });
    }
    res.status(200).json(foodItems);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching food items", error: error.message });
  }
};
const updateFoodItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Food item ID is required" });
    }
    const updates = req.body;
    if (updates.name) {
      updates.foodname = updates.name;
      delete updates.name;
    }

    const existingFoodItem = await FoodItems.findById(id);
    if (!existingFoodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    if (req.file) {
      if (existingFoodItem.imagePublicId) {
        await cloudinary.v2.uploader.destroy(existingFoodItem.imagePublicId);
      }
      updates.image = req.file.secure_url;
      updates.imagePublicId = req.file.public_id;
    }

    const updatedFoodItem = await FoodItems.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,
      },
    );
    if (!updatedFoodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }
    res.status(200).json(updatedFoodItem);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating food item", error: error.message });
  }
};
const deleteFoodItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Food item ID is required" });
    }
    const foodItem = await FoodItems.findById(id);
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }
    if (foodItem.imagePublicId) {
      try {
        await cloudinary.v2.uploader.destroy(foodItem.imagePublicId);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }
    await FoodItems.findByIdAndDelete(id);
    res.status(200).json({ message: "Food item deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting food item", error: error.message });
  }
};
const toggleFoodItemAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Food item ID is required" });
    }
    const foodItem = await FoodItems.findById(id);
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }
    const updatedFoodItem = await FoodItems.findByIdAndUpdate(
      id,
      { $set: { availability: !foodItem.availability } },
      { new: true }
    );
    res.status(200).json(updatedFoodItem);
  } catch (error) {
    res.status(500).json({
      message: "Error toggling food item availability",
      error: error.message,
    });
  }
};
module.exports = {
  createFoodItem,
  getFoodItems,
  updateFoodItem,
  deleteFoodItem,
  toggleFoodItemAvailability,
};
