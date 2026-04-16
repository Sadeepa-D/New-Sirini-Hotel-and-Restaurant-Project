const mongoose = require("mongoose");

const FoodItemSchema = new mongoose.Schema(
  {
    foodname: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    imagePublicId: {
      type: String,
      default: null,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("FoodItem", FoodItemSchema);
