const mongoose = require("mongoose");

const roomBookSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
    checkInDate: {
      type: Date,
      required: [true, "Check-in date is required"],
    },
    checkOutDate: {
      type: Date,
      required: [true, "Check-out date is required"],
    },
    roomNumber: {
      type: String,
      required: true,
    },
    bookingType: {
      type: String,
      enum: ["day-use"],
      default: "day-use",
    },
    timeSlot: {
      type: String,
      enum: ["day", "fullday"],
      required: [true, "Time slot is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Overdue"],
      default: "Pending",
    },

    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    bookingCode: { type: String, unique: true },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("RoomBook", roomBookSchema);
