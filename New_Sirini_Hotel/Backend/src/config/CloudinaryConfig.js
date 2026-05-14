const cloudinary = require("cloudinary");
const CloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.v2.config({
  cloud_name: "dj866gslt",
  api_key: "664183556577417",
  api_secret: process.env.CLOUDINARY_SECRETE,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "sirini_hotel",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
module.exports = upload;
