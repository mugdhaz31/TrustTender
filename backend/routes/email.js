const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

const otpStore = new Map();

// Helper to generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// 1️⃣ Send OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const otp = generateOtp();
    otpStore.set(email, otp);

    // --- Configure your mail transporter ---
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER, // your email
        pass: process.env.SMTP_PASS, // your app password
      },
    });

    // --- Mail content ---
    const mailOptions = {
      from: `"TrustTender Verification" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your TrustTender Email OTP",
      html: `
        <div style="font-family:sans-serif; line-height:1.5;">
          <h2>TrustTender Email Verification</h2>
          <p>Your one-time password (OTP) for verifying your email is:</p>
          <h3 style="background:#f0f0f0; display:inline-block; padding:10px 15px; border-radius:5px;">
            ${otp}
          </h3>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you didn’t request this, please ignore this email.</p>
        </div>
      `,
    };

    // --- Send email ---
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "OTP sent to your email." });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ message: "Failed to send OTP email." });
  }
});

// 2️⃣ Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const storedOtp = otpStore.get(email);

    if (!storedOtp) return res.status(400).json({ message: "No OTP sent for this email" });
    if (storedOtp !== otp) return res.status(400).json({ message: "Invalid OTP", verified: false });

    otpStore.delete(email); // consume OTP
    res.json({ verified: true });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
