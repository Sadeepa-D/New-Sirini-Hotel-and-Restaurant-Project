const nodemailer = require("nodemailer");

const transpoter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_ADDRES,
    pass: process.env.EMAIL_APPPASS,
  },
  family: 4,

  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transpoter;
