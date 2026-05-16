const mongoose = require("mongoose");

const LiquorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      // required: true,
    },
    buyingPrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    sellingPrice: {
      type: Number,
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

    imagePublicId: {
      type: String,
      default: null,
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
    stockType: {
      type: String,
      enum: ["Bottles", "Cases"],
      required: true,
    },
    bottlesPerCase: {
      type: Number,
      default: 0,
    },
    currentQuantityInBottels: {
      type: Number,
      default: 0,
    },
    currentQuantityInCases: {
      type: Number,
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Liquor", LiquorSchema);
