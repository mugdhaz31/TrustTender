const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../models/User"); // adjust path

// 2Factor API key
const API_KEY = process.env.TWOFAC_KEY || "YOUR_2FACTOR_API_KEY"; // store in .env

// In-memory store for session OTPs (for verification)
const otpStore = new Map();

// --- Send OTP ---
router.post("/send-otp", async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    // Call 2Factor.in API
    const smsResp = await axios.get(`https://2factor.in/API/V1/${API_KEY}/SMS/${phoneNumber}/AUTOGEN/OTP`);

    if (smsResp.data.Status === "Success") {
      // Save sessionId for verification
      otpStore.set(phoneNumber, { sessionId: smsResp.data.Details, expiresAt: Date.now() + 5 * 60 * 1000 });
      return res.json({ message: "OTP sent successfully" });
    } else {
      return res.status(500).json({ message: smsResp.data.Details || "Failed to send OTP" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// --- Verify OTP ---
router.post("/verify-otp", async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    if (!phoneNumber || !otp) {
      return res.status(400).json({ message: "Missing phone number or OTP" });
    }

    const record = otpStore.get(phoneNumber);
    if (!record) return res.status(400).json({ verified: false, message: "No OTP sent to this number" });
    if (Date.now() > record.expiresAt) {
      otpStore.delete(phoneNumber);
      return res.status(400).json({ verified: false, message: "OTP expired" });
    }

    // Verify OTP via 2Factor API
    const verifyResp = await axios.get(`https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY/${record.sessionId}/${otp}`);
    if (verifyResp.data.Status === "Success" && verifyResp.data.Details === "OTP Matched") {
      otpStore.delete(phoneNumber);

      // Optionally update user in DB
      // await User.findOneAndUpdate({ phoneNumber }, { phoneVerified: true });

      return res.json({ verified: true, message: "Phone verified successfully" });
    } else {
      return res.status(400).json({ verified: false, message: "OTP did not match" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ verified: false, message: "Verification failed" });
  }
});

module.exports = router;
