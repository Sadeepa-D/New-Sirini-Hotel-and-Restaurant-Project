const FoodItems = require("../../models/Restraunt/FoodItemModel");

const createFoodItem = async (req, res) => {
  try {
    const { name, price, description, category, portion, dietary, preparationTime } = req.body;
    if (!name || !price || !description || !category) {
      return res.status(400).json({ message: "Required fields are missing" });
    }
    const image = req.file ? req.file.path : null;
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
    if (req.file) {
      updates.image = req.file.path;
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
