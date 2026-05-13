const mongoose = require("mongoose");

const foodItemBookSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, ref: "User"
    },
    foodName: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
    quantity: {
      type: Number,
      required: true,
    },
    Price: {
      type: Number,
      required: true,
    },
    pickupDate: {
      type: Date,
      required: true,
    },
    pickupTime: {
      type: String,
      required: true,
    },
    orderCode: { type: String, unique: true },
    portion: {
      type: String,
      //  required: true,
      enum: ["Normal", "Full"],
      default: "Normal",
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Preparing", "Complete", "delete", "Overdue"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("FoodItemorder", foodItemBookSchema);
