const FoodItems = require("../../models/Restraunt/FoodItemModel");
const cloudinary = require("cloudinary");

const createFoodItem = async (req, res) => {
  try {
    console.log("Creating food item, body:", req.body);
    let {
      name,
      normal_price,
      full_price,
      description,
      category,
      has_portions,
    } = req.body;

    // Convert strings from FormData
    has_portions = has_portions === "true" || has_portions === true;

    // Comprehensive Validation
    if (!name)
      return res.status(400).json({ message: "Food name is required" });
    if (!description)
      return res.status(400).json({ message: "Description is required" });
    if (!category)
      return res.status(400).json({ message: "Category is required" });

    // Validate Prices
    if (
      normal_price === undefined ||
      normal_price === null ||
      normal_price === ""
    ) {
      return res.status(400).json({ message: "Normal price is required" });
    }
    normal_price = isNaN(Number(normal_price)) ? 0 : Number(normal_price);

    if (has_portions) {
      if (
        full_price === undefined ||
        full_price === null ||
        full_price === ""
      ) {
        return res
          .status(400)
          .json({
            message: "Full price is required when portions are enabled",
          });
      }
      full_price = isNaN(Number(full_price)) ? 0 : Number(full_price);
    } else {
      full_price = null;
    }

    const image = req.file ? req.file.secure_url || req.file.path : null;
    const imagePublicId = req.file
      ? req.file.public_id || req.file.filename
      : null;

    if (!image) {
      return res.status(400).json({ message: "Product image is required" });
    }

    const newFoodItem = new FoodItems({
      name,
      description,
      category,
      image,
      imagePublicId,
      has_portions,
      normal_price,
      full_price,
      status: "available",
      availability: true,
    });

    await newFoodItem.save();
    res.status(201).json(newFoodItem);
  } catch (error) {
    console.error("CRITICAL: Error in createFoodItem:", error);
    res
      .status(500)
      .json({
        message: "Internal Server Error during creation",
        error: error.message,
      });
  }
};

const getFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItems.find();
    res.status(200).json(foodItems || []);
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
      updates.has_portions =
        updates.has_portions === "true" || updates.has_portions === true;
    }

    const existingFoodItem = await FoodItems.findById(id);
    if (!existingFoodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    // Handle Image Update
    if (req.file) {
      if (existingFoodItem.imagePublicId) {
        try {
          // Use v2 explicitly to avoid undefined errors
          await cloudinary.v2.uploader.destroy(existingFoodItem.imagePublicId);
        } catch (err) {
          console.error("Cloudinary delete error:", err);
        }
      }
      updates.image = req.file.secure_url || req.file.path;
      updates.imagePublicId = req.file.public_id || req.file.filename;
    }

    // Logic for normal vs full price
    const hasPortionsFlag =
      updates.has_portions !== undefined
        ? updates.has_portions
        : existingFoodItem.has_portions;

    if (updates.normal_price !== undefined) {
      updates.normal_price = isNaN(Number(updates.normal_price))
        ? 0
        : Number(updates.normal_price);
    }

    if (hasPortionsFlag) {
      if (updates.full_price !== undefined) {
        updates.full_price = isNaN(Number(updates.full_price))
          ? 0
          : Number(updates.full_price);
      }
    } else {
      updates.full_price = null;
    }

    const updatedFoodItem = await FoodItems.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true },
    );

    if (!updatedFoodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }
    res.status(200).json(updatedFoodItem);
  } catch (error) {
    console.error("CRITICAL: Error in updateFoodItem:", error);
    res
      .status(500)
      .json({
        message: "Internal Server Error during update",
        error: error.message,
      });
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
      { new: true },
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
