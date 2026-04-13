const ReceptionHallPackage = require("../../models/Reception/ReceptionHallPackages");

const createReceptionHallPackage = async (req, res) => {
  try {
    const { name, description, price, features, seatings } = req.body;
    if (!name || !description || !price || !features || !seatings) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const image = req.file ? req.file.secure_url : null;
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
    res.status(200).json({ packages });
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
    if (req.file) {
      updates.image = req.file.path;
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
module.exports = {
  createReceptionHallPackage,
  getReceptionHallPackages,
  updateReceptionHallPackage,
  deleteReceptionHallPackage,
  toggleAvailability,
};
