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
    Phone: {
      type: String,
      required: [true, "please add Your Phone Number"],
      unique: true,
    },
    Role: {
      type: String,
      enum: ["user", "admin","manager"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please add a Password"],
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("User", userSchema);
