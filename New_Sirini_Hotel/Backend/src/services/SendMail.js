const nodemailer = require("nodemailer");

const transpoter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADDRES,
    pass: process.env.EMAIL_APPPASS,
  },
});

module.exports = transpoter;
