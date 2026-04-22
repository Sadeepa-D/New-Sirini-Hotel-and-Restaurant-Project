const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");

const registerUser = async (req, res) => {
  try {
    const { name, email, Phone, password } = req.body;
    if (!name || !email || !Phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      Phone,
      password: hashedPassword,
    });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({
      $or: [{ email: email }, { Phone: email }],
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.Status === "Suspended" || user.Status === "Deleted") {
      return res.status(403).json({
        message:
          "Your Account is " +
          user.Status +
          ". Please contact the Hotel Admin.",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        Phone: user.Phone,
        Role: user.Role,
        Status: user.Status,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        Phone: user.Phone,
        Role: user.Role,
        Status: user.Status,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getallUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.userData.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized User" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userData.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized User" });
    }
    const { name, email, Phone } = req.body;
    const updates = { name, email, Phone };
    if (req.file) {
      // Delete old image from Cloudinary if exists
      const existingUser = await User.findById(userId);
      if (existingUser.imagePublicId) {
        try {
          await cloudinary.v2.uploader.destroy(existingUser.imagePublicId);
        } catch (err) {
          console.error("Cloudinary delete error:", err);
        }
      }
      updates.image = req.file.secure_url;
      updates.imagePublicId = req.file.public_id;
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true },
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const UpdatePassword = async (req, res) => {
  try {
    const userId = req.userData.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both Current and New passwords are required" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;
    if (!userId || !newRole) {
      return res
        .status(400)
        .json({ message: "User ID and new role are required" });
    }
    const updateuser = await User.findByIdAndUpdate(
      userId,
      { $set: { Role: newRole } },
      { new: true },
    );
    if (!updateuser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updateuser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const suspendUser = async (req, res) => {
  try {
    const { userId, newStatus } = req.body;
    if (!userId || !newStatus) {
      return res
        .status(400)
        .json({ message: "User ID and new status are required" });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { Status: newStatus } },
      { new: true },
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { userId, deleteStatus } = req.body;
    if (!userId || !deleteStatus) {
      return res
        .status(400)
        .json({ message: "User ID and delete status are required" });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { Status: deleteStatus } },
      { new: true },
    );
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateuserdetails = async (req, res) => {
  try {
    const { userId, name, email, Phone } = req.body;
    if (!userId || !name || !email || !Phone) {
      return res
        .status(400)
        .json({ message: "User ID, name, email and phone are required" });
    }
    const userupdate = await User.findByIdAndUpdate(
      userId,
      { $set: { name: name, email: email, Phone: Phone } },
      { new: true },
    );
    if (!userupdate) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(userupdate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  UpdatePassword,
  getallUsers,
  updateUserRole,
  suspendUser,
  deleteUser,
  updateuserdetails,
};
