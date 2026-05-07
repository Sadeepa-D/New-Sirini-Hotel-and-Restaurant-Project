const Gallery = require("../models/Gallery");
const cloudinary = require("cloudinary");

const createGalleryItem = async (req, res) => {
  try {
    const { category } = req.body;
    const image = req.file.secure_url;
    const imagePublicId = req.file.public_id;

    const newGalleryItem = new Gallery({
      image,
      imagePublicId,
      category,
    });

    await newGalleryItem.save();
    res.status(201).json(newGalleryItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGalleryItems = async (req, res) => {
  try {
    const items = await Gallery.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    if (item.imagePublicId) {
      await cloudinary.uploader.destroy(item.imagePublicId);
    }

    await Gallery.findByIdAndDelete(id);

    res.status(200).json({ message: "Gallery item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createGalleryItem,
  getGalleryItems,
  deleteGalleryItem,
};
