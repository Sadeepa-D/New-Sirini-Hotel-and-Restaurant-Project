const mongoose = require("mongoose");

const LiquorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    alcoholPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },

    image: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    volume: {
      type: String,
    },

    origin: {
      type: String,
    },

    brand: {
      type: String,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Liquor", LiquorSchema);
