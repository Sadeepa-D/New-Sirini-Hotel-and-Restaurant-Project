const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    imagePublicId: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Gallery", gallerySchema);
