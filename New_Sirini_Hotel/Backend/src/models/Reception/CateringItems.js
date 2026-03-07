const mongoose = require("mongoose");

const cateringItemsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    priceperserving: {
      type: [String],
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("CateringItem", cateringItemsSchema);
