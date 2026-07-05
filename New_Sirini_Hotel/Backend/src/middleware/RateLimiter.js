const ratelimiter = require("express-rate-limit");

const apiLimiter = ratelimiter({
  windowMs: 15 * 60 * 1000, // 15
  max: 200,
  message: {
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = ratelimiter({
  windowMs: 15 * 60 * 1000, // 15
  max: 5, //
  message: {
    message: "Too many login attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = ratelimiter({
  windowMs: 60 * 60 * 1000, // 1
  max: 10,
  message: {
    message: "Too many registration attempts, please try again after 1 hour",
  },
});

const otpLimiter = ratelimiter({
  windowMs: 10 * 60 * 1000, // 10
  max: 4,
  message: {
    message: "Too many OTP requests, please try again after 10 minutes",
  },
});

module.exports = {
  apiLimiter,
  loginLimiter,
  registerLimiter,
  otpLimiter,
};
