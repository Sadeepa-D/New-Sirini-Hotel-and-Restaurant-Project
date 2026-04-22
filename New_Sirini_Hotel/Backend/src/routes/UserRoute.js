const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const UserController = require("../controllers/UserController");
const upload = require("../config/CloudinaryConfig");

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/profile", authMiddleware, UserController.getUserProfile);
router.put(
  "/profile/update",
  authMiddleware,
  upload.single("image"),
  UserController.updateUserProfile,
);
router.put(
  "/profile/updatepassword",
  authMiddleware,
  UserController.UpdatePassword,
);
router.get("/getall/users", UserController.getallUsers);

module.exports = router;
