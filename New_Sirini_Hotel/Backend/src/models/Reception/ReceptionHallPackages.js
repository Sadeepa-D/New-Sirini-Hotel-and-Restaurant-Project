const mongoose = require("mongoose");

const receptionHallPackagesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    features: {
      type: [String],
      required: true,
    },
    seatings: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      enum: [true, false],
      default: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model(
  "ReceptionHallPackage",
  receptionHallPackagesSchema,
);
