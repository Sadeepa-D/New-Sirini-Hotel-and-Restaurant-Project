const mongoose = require("mongoose");

const reciptionAppointSchema = new mongoose.Schema(
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
      match: [/^[0-9\s\+\-]{9,15}$/, "Please enter a valid phone number"],
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled", "Overdue"],
      default: "Pending",
    },
    noOfGuests: {
      type: Number,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    appointcode: { type: String, unique: true },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("ReciptionAppoint", reciptionAppointSchema);
