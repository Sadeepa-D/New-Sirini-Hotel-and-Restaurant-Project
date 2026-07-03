const Adevertisment = require("../../models/Reception/AdvertisingModel");
const User = require("../../models/UserModel");
const NotifiModel = require("../../models/NotifiModel");
const { sendAdvertismentEmail } = require("../EmailCont");
const cloudinary = require("cloudinary");

const createAdvertisment = async (req, res) => {
  try {
    const userId = req.userData?.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.Phone) {
      return res.status(400).json({
        message:
          "Please update your profile with a phone number before creating an advertisement.",
      });
    }

    const {
      BuissnesName,
      BuissnessOwnerName,
      NIC,
      category,
      description,
      portfolio,
      EmailAddress,
      price,
      location,
      TPNumber,
    } = req.body;
    if (
      !BuissnesName ||
      !BuissnessOwnerName ||
      !NIC ||
      !category ||
      !description ||
      !EmailAddress ||
      !price ||
      !location ||
      !TPNumber
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate NIC format (should be 9 digits followed by a digit or X)
    const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;

    if (!nicRegex.test(NIC)) {
      return res.status(400).json({
        message: "Invalid NIC format.",
        example: "Old: 123456789V | New: 200012345678",
      });
    }

    // Validate TPNumber format (should be 10 digits)
    const phoneRegex =  /^(?:\+94|0)?(7[0-8]\d{7}|[1-9]\d{8})$/;
    if (!phoneRegex.test(TPNumber)) {
      return res.status(400).json({
        message: "Invalid phone number format. Should be exactly 10 digits",
        example: "0712345678",
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(EmailAddress)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const image = req.file ? req.file.secure_url : null;
    const imagePublicId = req.file ? req.file.public_id : null;
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }
    const newAdvertisment = new Adevertisment({
      userId,
      BuissnesName,
      BuissnessOwnerName,
      NIC,
      category,
      description,
      image,
      imagePublicId,
      portfolio,
      EmailAddress,
      price,
      location,
      TPNumber,
      status: "pending",
    });
    await newAdvertisment.save();

    await sendAdvertismentEmail({
      email: EmailAddress,
      BuissnesName,
      BuissnessOwnerName,
      NIC,
      category,
      description,
      price,
      location,
      TPNumber,
      newAdvertisment,
    });

    try {
      const newnotification = new NotifiModel({
        userId,
        title: "Advertisment Created and Pending for Approval",
        message: `Your advertisment ${BuissnesName} is created and pending for approval. We will contact you soon.`,
      });
      await newnotification.save();

      const managers = await User.find({
        Role: "Operation Manager 2 (Reception, Room)",
      }).select("_id");

      if (managers.length > 0) {
        await NotifiModel.insertMany(
          managers.map((manager) => ({
            userId: manager._id,
            title: "New Advertisment Pending Approval",
            message: `${BuissnesName} (owner: ${BuissnessOwnerName}) submitted a new advertisment. Please review and approve.`,
          })),
        );
      } else {
        console.warn("No managers found for new advertisment notification");
      }
    } catch (notifError) {
      console.error("Notification error (non-blocking):", notifError);
    }

    res.status(201).json({
      message: "Advertisment created successfully",
    });
  } catch (error) {
    console.error("Error creating advertisment:", error);
    // Return detailed error information for debugging
    const errorMessage = error.message || "Server error";
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    res.status(statusCode).json({
      message: "Failed to create advertisement",
      error: errorMessage,
      details: error.errors || undefined,
    });
  }
};
const getAdvertisments = async (req, res) => {
  try {
    const advertisments = await Adevertisment.find().sort({ createdAt: -1 });
    if (advertisments.length === 0) {
      return res.status(404).json({ message: "No advertisments found" });
    }
    res.status(200).json(advertisments);
  } catch (error) {
    console.error("Error fetching advertisments:", error);
    res.status(500).json({
      message: "Failed to fetch advertisements",
      error: error.message,
    });
  }
};

const deleteAdvertisment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Advertisment ID is required" });
    }
    const advertisment = await Adevertisment.findById(id);
    if (!advertisment) {
      return res.status(404).json({ message: "Advertisment not found" });
    }
    if (advertisment.imagePublicId) {
      try {
        await cloudinary.v2.uploader.destroy(advertisment.imagePublicId);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
      }
    }
    const deletedAdvertisment = await Adevertisment.findByIdAndDelete(id);
    if (!deletedAdvertisment) {
      return res.status(404).json({ message: "Advertisment not found" });
    }
    res.status(200).json({ message: "Advertisment deleted successfully" });
  } catch (error) {
    console.error("Error deleting advertisment:", error);
    res.status(500).json({
      message: "Failed to delete advertisement",
      error: error.message,
    });
  }
};

const updateAdvertisment = async (req, res) => {
  try {
    const userId = req.userData?.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.Phone) {
      return res.status(400).json({
        message:
          "Please update your profile with a phone number before Updating an Advertisment.",
      });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Advertisment ID is required" });
    }
    const updateData = req.body;
    const existingAdvertisment = await Adevertisment.findById(id);
    if (!existingAdvertisment) {
      return res.status(404).json({ message: "Advertisment not found" });
    }

    if (req.file) {
      if (existingAdvertisment.imagePublicId) {
        await cloudinary.v2.uploader.destroy(
          existingAdvertisment.imagePublicId,
        );
      }
      updateData.image = req.file.secure_url;
      updateData.imagePublicId = req.file.public_id;
    }

    const updatedAdvertisment = await Adevertisment.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );
    if (!updatedAdvertisment) {
      return res.status(404).json({ message: "Advertisment not found" });
    }
    res.status(200).json({
      message: "Advertisment updated successfully",
      advertisment: updatedAdvertisment,
    });
    const managers = await User.find({
      Role: "Operation Manager 2 (Reception, Room)",
    }).select("_id");
    await Promise.all(
      managers.map(async (manager) => {
        const newnotification = new NotifiModel({
          userId: manager._id,
          title: "Advertisment Updated",
          message: `The advertisment ${updatedAdvertisment.BuissnesName} has been updated. Please review the changes.`,
        });
        await newnotification.save();
      }),
    );
  } catch (error) {
    console.error("Error updating advertisment:", error);
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    res.status(statusCode).json({
      message: "Failed to update advertisement",
      error: error.message,
      details: error.errors || undefined,
    });
  }
};
const toggleAdvertismentStatustoApproved = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Advertisment ID is required" });
    }
    const updatedAdvertisment = await Adevertisment.findByIdAndUpdate(
      id,
      { $set: { status: "approved" } },
      { new: true },
    );
    if (!updatedAdvertisment) {
      return res.status(404).json({ message: "Advertisment not found" });
    }
    res.status(200).json({
      message: "Advertisment status updated to approved",
      advertisment: updatedAdvertisment,
    });
    const newnotification = new NotifiModel({
      userId: updatedAdvertisment.userId,
      title: "Advertisment Approved",
      message: `Your advertisment ${updatedAdvertisment.BuissnesName} is Live Now Visit the advertisment section to see your advertisment`,
    });
    await newnotification.save();
  } catch (error) {
    console.error("Error updating advertisment status:", error);
    res.status(500).json({
      message: "Failed to update advertisement status",
      error: error.message,
    });
  }
};

const toggleAdvertismentStatustoRejected = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Advertisment ID is required" });
    }
    const updatedAdvertisment = await Adevertisment.findByIdAndUpdate(
      id,
      { $set: { status: "rejected" } },
      { new: true },
    );
    if (!updatedAdvertisment) {
      return res.status(404).json({ message: "Advertisment not found" });
    }
    res.status(200).json({
      message: "Advertisment status updated to rejected",
      advertisment: updatedAdvertisment,
    });
    const newnotification = new NotifiModel({
      userId: updatedAdvertisment.userId,
      title: "Advertisment Rejected",
      message: `Your advertisment ${updatedAdvertisment.BuissnesName} is rejected. Please Contact admin for more details.`,
    });
    await newnotification.save();
  } catch (error) {
    console.error("Error updating advertisment status:", error);
    res.status(500).json({
      message: "Failed to update advertisement status",
      error: error.message,
    });
  }
};

const toggleAdvertismentStatustoPending = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Advertisment ID is required" });
    }
    const updatedAdvertisment = await Adevertisment.findByIdAndUpdate(
      id,
      { $set: { status: "pending" } },
      { new: true },
    );
    if (!updatedAdvertisment) {
      return res.status(404).json({ message: "Advertisment not found" });
    }
    res.status(200).json({
      message: "Advertisment status updated to pending",
      advertisment: updatedAdvertisment,
    });
  } catch (error) {
    console.error("Error updating advertisment status:", error);
    res.status(500).json({
      message: "Failed to update advertisement status",
      error: error.message,
    });
  }
};

const getPendingAdvertisments = async (req, res) => {
  try {
    const pendingAdvertisments = await Adevertisment.find({
      status: "pending",
    }).sort({ createdAt: -1 });
    res.status(200).json(pendingAdvertisments);
  } catch (error) {
    console.error("Error fetching pending advertisments:", error);
    res.status(500).json({
      message: "Failed to fetch pending advertisements",
      error: error.message,
    });
  }
};
const getApprovedAdvertisments = async (req, res) => {
  try {
    const approvedAdvertisments = await Adevertisment.find({
      status: "approved",
    }).sort({ createdAt: -1 });
    res.status(200).json(approvedAdvertisments);
  } catch (error) {
    console.error("Error fetching approved advertisments:", error);
    res.status(500).json({
      message: "Failed to fetch approved advertisements",
      error: error.message,
    });
  }
};
const getRejectedAdvertisments = async (req, res) => {
  try {
    const rejectedAdvertisments = await Adevertisment.find({
      status: "rejected",
    }).sort({ createdAt: -1 });
    res.status(200).json(rejectedAdvertisments);
  } catch (error) {
    console.error("Error fetching rejected advertisments:", error);
    res.status(500).json({
      message: "Failed to fetch rejected advertisements",
      error: error.message,
    });
  }
};

const getSpecificUserAdvertisments = async (req, res) => {
  try {
    const userId = req.userData?.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const userAdvertisments = await Adevertisment.find({ userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(userAdvertisments);
  } catch (error) {
    console.error("Error fetching user advertisments:", error);
    res.status(500).json({
      message: "Failed to fetch user advertisements",
      error: error.message,
    });
  }
};
module.exports = {
  createAdvertisment,
  getAdvertisments,
  deleteAdvertisment,
  updateAdvertisment,
  toggleAdvertismentStatustoApproved,
  toggleAdvertismentStatustoRejected,
  toggleAdvertismentStatustoPending,
  getPendingAdvertisments,
  getApprovedAdvertisments,
  getRejectedAdvertisments,
  getSpecificUserAdvertisments,
};
