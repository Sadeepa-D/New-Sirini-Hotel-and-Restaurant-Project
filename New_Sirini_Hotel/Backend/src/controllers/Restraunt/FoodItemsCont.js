const FoodItems = require("../../models/Restraunt/FoodItemModel");
const cloudinary = require("cloudinary");

const createFoodItem = async (req, res) => {
  try {
    console.log("Creating food item, body:", req.body);
    let { name, regular_price, description, category, has_portions, portions } = req.body;

    // Convert strings from FormData
    has_portions = has_portions === "true" || has_portions === true;
    if (typeof portions === "string") {
      try {
        portions = JSON.parse(portions);
      } catch (e) {
        portions = [];
      }
    }

    if (!name || !description || !category) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    if (has_portions) {
      if (!portions || portions.length < 2) {
        return res.status(400).json({ message: "Both portion prices are required when portions are enabled" });
      }
    } else {
      if (!regular_price) {
        return res.status(400).json({ message: "Regular price is required when portions are disabled" });
      }
    }

    const image = req.file ? req.file.secure_url : req.file ? req.file.path : null;
    const imagePublicId = req.file ? req.file.public_id : req.file ? req.file.filename : null;
    
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newFoodItem = new FoodItems({
      name,
      description,
      category,
      image,
      imagePublicId,
      has_portions,
      regular_price: has_portions ? null : regular_price,
      portions: has_portions ? portions : [],
      status: "available",
      availability: true,
    });
    await newFoodItem.save();
    res.status(201).json(newFoodItem);
  } catch (error) {
    console.error("Error in createFoodItem:", error);
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

    const updates = { ...req.body };
    
    // Convert strings from FormData
    if (updates.has_portions !== undefined) {
      updates.has_portions = updates.has_portions === "true" || updates.has_portions === true;
    }
    if (typeof updates.portions === "string") {
      try {
        updates.portions = JSON.parse(updates.portions);
      } catch (e) {
        updates.portions = [];
      }
    }

    const existingFoodItem = await FoodItems.findById(id);
    if (!existingFoodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    if (req.file) {
      if (existingFoodItem.imagePublicId) {
        try {
          await cloudinary.v2.uploader.destroy(existingFoodItem.imagePublicId);
        } catch (err) {
          console.error("Cloudinary delete error:", err);
        }
      }
      updates.image = req.file.secure_url;
      updates.imagePublicId = req.file.public_id;
    }

    // Logic for portions vs regular price
    if (updates.has_portions === true) {
      updates.regular_price = null;
    } else if (updates.has_portions === false) {
      updates.portions = [];
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
