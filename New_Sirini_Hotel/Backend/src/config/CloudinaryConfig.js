const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary"); // Destructure the class
const multer = require("multer");

cloudinary.config({
  cloud_name: "dj866gslt",
  api_key: "664183556577417",
  api_secret: "Q_I5jZLICqtrau10sobZEGfySfs",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "sirini_hotel",
    allowed_formats: ["jpg", "png", "jpeg"], // Note the underscore in allowed_formats
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
// re-trigger restart
