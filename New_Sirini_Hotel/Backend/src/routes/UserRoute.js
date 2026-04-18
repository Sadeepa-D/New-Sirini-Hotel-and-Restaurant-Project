const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const UserController = require("../controllers/UserController");

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/profile", authMiddleware, UserController.getUserProfile);
router.put("/profile/update", authMiddleware, UserController.updateUserProfile);
router.put("/profile/updatepassword", authMiddleware, UserController.UpdatePassword);
module.exports = router;
