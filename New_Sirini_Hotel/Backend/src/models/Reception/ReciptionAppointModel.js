// Name
// Email
// Phone number
// Date

const mongoose = require("mongoose");

const reciptionAppointSchema = new mongoose.Schema(
  {
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
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled", "Overdue"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("ReciptionAppoint", reciptionAppointSchema);
