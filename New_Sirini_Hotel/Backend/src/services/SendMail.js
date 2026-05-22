const nodemailer = require("nodemailer");

const transpoter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ADDRES,
    pass: process.env.EMAIL_APPPASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  family: 4,
});

module.exports = transpoter;
