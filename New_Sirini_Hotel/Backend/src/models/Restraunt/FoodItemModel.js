const mongoose = require("mongoose");

const FoodItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
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
    category: {
      type: String,
      required: true,
    },
    has_portions: {
      type: Boolean,
      default: false,
    },
    normal_price: {
      type: Number,
      required: true,
    },
    full_price: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
    availability: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("FoodItem", FoodItemSchema);
