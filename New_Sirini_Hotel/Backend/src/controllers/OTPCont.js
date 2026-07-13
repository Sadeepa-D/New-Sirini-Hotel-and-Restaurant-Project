const OTPModel = require("../models/OTPModel");
const transpoter = require("../services/SendMail");

const sendOTPEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const response = await OTPModel.findOneAndUpdate(
      { email },
      {
        email,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        attempts: 0,
      },
      { upsert: true },
    );
    /*
    await transpoter.sendMail({
      from: process.env.EMAIL_ADDRES,
      to: email,
      subject: "Your one-time OTP Code for Sirini Hotel registration",
      html: `<h2>Your code is: ${otp} It will expire in 10 minutes.</h2>`,
    });
    */
    console.log(`[BYPASSED EMAIL] OTP Code for ${email} is: ${otp}`);
    res.status(200).json({ message: "OTP email sent successfully" });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ message: "Failed to send OTP email" });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const response = await OTPModel.findOne({ email });
    if (!response) {
      return res.status(400).json({ message: "no code found for this email" });
    }
    if (Date.now() > response.expiresAt.getTime()) {
      return res.status(400).json({ message: "OTP has expired" });
    }
    if (response.attempts >= 5) {
      return res.status(429).json({ message: "Too many attempts" });
    }
    if (response.otp !== otp) {
      response.attempts += 1;
      await response.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await OTPModel.findOneAndDelete({ email });
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};

module.exports = {
  sendOTPEmail,
  verifyOTP,
};
