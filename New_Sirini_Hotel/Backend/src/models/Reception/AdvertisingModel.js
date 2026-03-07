const mongoose = require("mongoose");

const advertisingSchema = new mongoose.Schema(
  {
    BuissnesName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Photography", "Sounds", "Decoration"],
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
    portfolio: {
      type: String,
    },
    price: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    TPNumber: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Advertising", advertisingSchema);
