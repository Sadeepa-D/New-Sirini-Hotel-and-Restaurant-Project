const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    roomType: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    shortStayPrice: {
      type: Number,
      default: 1500,
    },
    bedType: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: ["available", "reserved", "maintenance"],
      default: "available",
    },
    image: {
      type: String,
      required: true,
    },

    condition: {
      type: String,
      enum: ["AC", "Fan"],
      default: "Fan",
    },

    description: {
      type: String,
      default: "",
    },
    imagePublicId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Room", RoomSchema);
