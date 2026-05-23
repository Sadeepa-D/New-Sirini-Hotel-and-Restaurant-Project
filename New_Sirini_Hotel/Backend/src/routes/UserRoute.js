const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/AuthMiddleware");
const RoleBaseMiddleware = require("../middleware/RoleBaseMiddleware");
const UserController = require("../controllers/UserController");
const OTPController = require("../controllers/OTPCont");
const upload = require("../config/CloudinaryConfig");

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);``
router.post("/googlelogin", UserController.googlelogin);
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
router.get("/getall/users",authMiddleware,RoleBaseMiddleware(["Admin"]), UserController.getallUsers);
router.put("/update/role",authMiddleware,RoleBaseMiddleware(["Admin"]), UserController.updateUserRole);
router.put("/update/userstatus",authMiddleware,RoleBaseMiddleware(["Admin"]), UserController.suspendUser);
router.put("/delete/user", authMiddleware, RoleBaseMiddleware(["Admin"]), UserController.deleteUser);
router.put("/update/userdetails", authMiddleware, RoleBaseMiddleware(["Admin"]), UserController.updateuserdetails);
router.put("/reset/userpassword", authMiddleware, RoleBaseMiddleware(["Admin"]), UserController.resetuserpassword);
router.post("/sendotp", OTPController.sendOTPEmail);
router.post("/verifyotp", OTPController.verifyOTP);
router.put("/deactivate/account", authMiddleware, UserController.deactivateaccount);

module.exports = router;
