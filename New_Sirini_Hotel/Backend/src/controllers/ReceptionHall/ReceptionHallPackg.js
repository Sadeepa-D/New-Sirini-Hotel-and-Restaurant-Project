const ReceptionHallPackage = require("../../models/Reception/ReceptionHallPackages");
const cloudinary = require("cloudinary");

const createReceptionHallPackage = async (req, res) => {
  try {
    const { name, description, price, features, seatings } = req.body;
    if (!name || !description || !price || !features || !seatings) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const image = req.file ? req.file.secure_url : null;
    const imagePublicId = req.file ? req.file.public_id : null;
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }
    const newPackage = new ReceptionHallPackage({
      name,
      description,
      price,
      features,
      seatings,
      image,
      imagePublicId,
      status: true,
    });
    await newPackage.save();
    res.status(201).json({
      message: "Reception hall package created successfully",
      package: newPackage,
    });
  } catch (error) {
    console.error("Error creating reception hall package:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getReceptionHallPackages = async (req, res) => {
  try {
    const packages = await ReceptionHallPackage.find();
    if (packages.length === 0) {
      return res
        .status(404)
        .json({ message: "No reception hall packages found" });
    }
    res.status(200).json(packages);
  } catch (error) {
    console.error("Error fetching reception hall packages:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const updateReceptionHallPackage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Package ID is required" });
    }
    const updates = req.body;

    const existingPackage = await ReceptionHallPackage.findById(id);
    if (!existingPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    if (req.file) {
      if (existingPackage.imagePublicId) {
        await cloudinary.v2.uploader.destroy(existingPackage.imagePublicId);
      }
      updates.image = req.file.secure_url;
      updates.imagePublicId = req.file.public_id;
    }

    const updatedPackage = await ReceptionHallPackage.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true },
    );
    if (!updatedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.status(200).json({ message: "Package updated successfully" });
  } catch (error) {
    console.error("Error updating reception hall package:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const deleteReceptionHallPackage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Package ID is required" });
    }
    const item = await ReceptionHallPackage.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Package not found" });
    }
    if (item.imagePublicId) {
      try {
        await cloudinary.v2.uploader.destroy(item.imagePublicId);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
      }
    }

    const deletedPackage = await ReceptionHallPackage.findByIdAndDelete(id);
    if (!deletedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("Error deleting reception hall package:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Package ID is required" });
    }
    const AvailablePackage = await ReceptionHallPackage.findById(id);
    if (!AvailablePackage) {
      return res.status(404).json({ message: "Package not found" });
    }
    AvailablePackage.status = !AvailablePackage.status;
    await AvailablePackage.save();
    res.status(200).json(AvailablePackage);
  } catch (error) {
    console.error("Error toggling package availability:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPackageCateringItems = async (req, res) => {
  try {
    const { id } = req.params;
    const packageData = await ReceptionHallPackage.findById(id).populate({
      path: "cateringItems",
      model: "CateringItem",
    });
    if (!packageData) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.status(200).json(packageData.cateringItems || []);
  } catch (error) {
    console.error("Error fetching package catering items:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const addCateringToPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { cateringItemId } = req.body;

    if (!id || !cateringItemId) {
      return res
        .status(400)
        .json({ message: "Package ID and catering item ID are required" });
    }

    const packageData = await ReceptionHallPackage.findById(id);
    if (!packageData) {
      return res.status(404).json({ message: "Package not found" });
    }

    if (packageData.cateringItems.includes(cateringItemId)) {
      return res
        .status(400)
        .json({ message: "Item already added to this package" });
    }

    packageData.cateringItems.push(cateringItemId);
    await packageData.save();

    const updatedPackage = await ReceptionHallPackage.findById(id).populate({
      path: "cateringItems",
      model: "CateringItem",
    });
    res.status(200).json(updatedPackage.cateringItems);
  } catch (error) {
    console.error("Error adding catering item to package:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const removeCateringFromPackage = async (req, res) => {
  try {
    const { id, itemId } = req.params;

    if (!id || !itemId) {
      return res
        .status(400)
        .json({ message: "Package ID and item ID are required" });
    }

    const packageData = await ReceptionHallPackage.findById(id);
    if (!packageData) {
      return res.status(404).json({ message: "Package not found" });
    }

    packageData.cateringItems = packageData.cateringItems.filter(
      (item) => item.toString() !== itemId,
    );
    await packageData.save();

    const updatedPackage = await ReceptionHallPackage.findById(id).populate({
      path: "cateringItems",
      model: "CateringItem",
    });
    res.status(200).json(updatedPackage.cateringItems);
  } catch (error) {
    console.error("Error removing catering item from package:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createReceptionHallPackage,
  getReceptionHallPackages,
  updateReceptionHallPackage,
  deleteReceptionHallPackage,
  toggleAvailability,
  getPackageCateringItems,
  addCateringToPackage,
  removeCateringFromPackage,
};
