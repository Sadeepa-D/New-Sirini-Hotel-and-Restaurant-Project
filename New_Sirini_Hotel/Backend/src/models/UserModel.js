const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Fill The Name"],
    },
    email: {
      type: String,
      required: [true, "please add Your Email"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    image: {
      type: String,
      default: null,
    },

    imagePublicId: {
      type: String,
      default: null,
    },

    Phone: {
      type: String,
      required: [true, "please add Your Phone Number"],
      unique: true,
    },
    Role: {
      type: String,
      default: "User",
    },
    password: {
      type: String,
      required: [true, "Please add a Password"],
    },
    Status: {
      type: String,
      enum: ["Active", "Suspended", "Deleted"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("User", userSchema);
