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
    default: null,
    },
    Role: {
      type: String,
      default: "User",
    },
    password: {
      type: String,
      default: null,
    },
    Status: {
      type: String,
      enum: ["Active", "Suspended", "Deleted"],
      default: "Active",
    },
    authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
   googleId: {
    type: String,
    default: null,
  },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("User", userSchema);
