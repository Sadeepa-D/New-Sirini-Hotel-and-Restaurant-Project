const Liquor = require("../models/Liquor");
const User = require("../models/UserModel");
const NotifiModel = require("../models/NotifiModel");
const cloudinary = require("cloudinary");

const addLiquor = async (req, res) => {
  try {
    const {
      name,
      buyingPrice,
      discount,
      sellingPrice,
      category,
      alcoholPercentage,
      description,
      volume,
      origin,
      brand,
      stockType,
      bottlesPerCase,
      currentQuantityInBottles,
      currentQuantityInCases,
      lowStockThreshold,
    } = req.body;

    if (
      !name ||
      !buyingPrice ||
      !sellingPrice ||
      !category ||
      !stockType ||
      !volume ||
      !brand
    ) {
      return res.status(400).json({
        message:
          "Name, Buying Price, Selling Price, Category, Volume, and Brand are required",
      });
    }
    if (isNaN(buyingPrice) || buyingPrice <= 0) {
      return res
        .status(400)
        .json({ message: "Buying Price must be a positive number" });
    }
    if (isNaN(sellingPrice) || sellingPrice <= 0) {
      return res
        .status(400)
        .json({ message: "Selling Price must be a positive number" });
    }

    if (sellingPrice <= buyingPrice) {
      return res
        .status(400)
        .json({ message: "Selling Price must be greater than Buying Price" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const image = req.file.path || req.file.secure_url;
    const imagePublicId = req.file.filename || req.file.public_id;

    const casesQty = Number(currentQuantityInCases) || 0;
    const bpcNum = Number(bottlesPerCase) || 0;
    const bottlesQty = Number(currentQuantityInBottles) || 0;

    let calculatedBottles = bottlesQty;
    if (stockType === "Cases" && bottlesQty === 0) {
      calculatedBottles = casesQty * bpcNum;
    }

    const newLiquor = new Liquor({
      name,
      buyingPrice,
      discount,
      sellingPrice,
      category,
      alcoholPercentage,
      image,
      imagePublicId,
      description,
      volume,
      origin,
      brand,
      isAvailable: true,
      stockType: stockType || "Bottles",
      bottlesPerCase: bpcNum,
      currentQuantityInBottles: calculatedBottles,
      currentQuantityInCases: casesQty,
      lowStockThreshold: Number(lowStockThreshold) || 0,
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
    if (liquor.discount !== 0) {
      liquor.forEach((item) => {
        item.price =
          item.sellingPrice - (item.sellingPrice * item.discount) / 100;
      });
    }
    res.status(200).json(liquor);
  } catch (error) {
    console.error("error:", error);
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

const decreaseLiquorInventory = async (req, res) => {
  try {
    const { id } = req.body;
    const { quantity } = req.body;

    if (!id || !quantity) {
      return res
        .status(400)
        .json({ message: "Liquor ID and quantity are required" });
    }
    const liquor = await Liquor.findById(id);
    if (!liquor) {
      return res.status(404).json({ message: "Liquor not found" });
    }
    if (liquor.currentQuantityInBottles < quantity) {
      return res.status(400).json({ message: "Not enough stock to decrease" });
    }
    liquor.currentQuantityInBottles -= quantity;
    await liquor.save();

    const lowStockThreshold = liquor.lowStockThreshold;
    if (liquor.currentQuantityInBottles <= lowStockThreshold) {
      try {
        const managers = await User.find({
          Role: "Operation Manager 1 (Restraunt,Liquor)",
        }).select("_id");

        if (managers.length > 0) {
          await NotifiModel.insertMany(
            managers.map((manager) => ({
              userId: manager._id,
              title: "Low Liquor Stock Alert",
              message: `${liquor.name} stock is low. Remaining: ${liquor.currentQuantityInBottles} bottle(s). Please restock soon.`,
            })),
          );
        } else {
          console.warn("No managers found for low stock notification");
        }
      } catch (notifError) {
        console.error("Notification error (non-blocking):", notifError);
      }
    }
    res.status(200).json(liquor);
  } catch (error) {
    res.status(500).json({
      message: "Error decreasing liquor inventory",
      error: error.message,
    });
  }
};

const increaseLiquorInventory = async (req, res) => {
  try {
    const { id } = req.body;
    const { quantity } = req.body;

    if (!id || !quantity) {
      return res
        .status(400)
        .json({ message: "Liquor ID and quantity are required" });
    }
    const liquor = await Liquor.findById(id);
    if (!liquor) {
      return res.status(404).json({ message: "Liquor not found" });
    }
    liquor.currentQuantityInBottles += quantity;
    await liquor.save();
    res.status(200).json(liquor);
  } catch (error) {
    res.status(500).json({
      message: "Error increasing liquor inventory",
      error: error.message,
    });
  }
};

module.exports = {
  addLiquor,
  getAllLiquor,
  deleteLiquor,
  updateLiquor,
  toggleAvailability,
  decreaseLiquorInventory,
  increaseLiquorInventory,
};
