// routes/aadhaar.js
const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const OTP_TTL = parseInt(process.env.AADHAAR_OTP_TTL_SECONDS || '300', 10); // seconds
const MAX_ATTEMPTS = parseInt(process.env.AADHAAR_MAX_OTP_ATTEMPTS || '5', 10);

const otpStore = new Map(); 
// value: { otp, expiresAt: timestamp, attempts: int, aadhaarHash, aadhaarToken }

function hashAadhaar(aadhaar) {
  const secret = process.env.AADHAAR_HMAC_SECRET || "demo_secret";
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(aadhaar);
  return hmac.digest("hex");
}

// Helper to create a token referencing verification
function makeAadhaarToken() {
  return crypto.randomBytes(20).toString("hex");
}

// POST /api/aadhaar/send-otp
// body: { aadhaarNumber, phoneNumber }  (phone used for real provider)
router.post("/send-otp", (req, res) => {
  try {
    const { aadhaarNumber, phoneNumber } = req.body;
    if (!aadhaarNumber || !/^\d{12}$/.test(aadhaarNumber)) {
      return res.status(400).json({ message: "Invalid Aadhaar number" });
    }
    if (!phoneNumber) {
      return res.status(400).json({ message: "Missing phoneNumber" });
    }

    const aadhaarHash = hashAadhaar(aadhaarNumber);

    // rate-limiting: check existing OTP and attempts
    const existing = otpStore.get(aadhaarHash);
    if (existing && Date.now() < existing.expiresAt && existing.attempts >= MAX_ATTEMPTS) {
      return res.status(429).json({ message: "Too many OTP attempts. Try later." });
    }

    // Generate mock OTP; for production call UIDAI / partner API
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit

    const expiresAt = Date.now() + OTP_TTL * 1000;
    otpStore.set(aadhaarHash, {
      otp,
      expiresAt,
      attempts: existing ? existing.attempts : 0,
      aadhaarHash,
      // aadhaarToken only created upon successful verify
    });

    // IMPORTANT: In production you'd trigger an SMS with the OTP via an SMS provider or UIDAI flow.
    console.log(`MOCK Aadhaar OTP for hash: ${otp}`); // remove in prod

    return res.json({ message: "OTP sent (mock).", requestId: aadhaarHash });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/aadhaar/verify-otp
// body: { aadhaarNumber, otp }
router.post("/verify-otp", (req, res) => {
  try {
    const { aadhaarNumber, otp } = req.body;
    if (!aadhaarNumber || !otp) return res.status(400).json({ message: "Missing fields" });

    const aadhaarHash = hashAadhaar(aadhaarNumber);
    const record = otpStore.get(aadhaarHash);

    if (!record) return res.status(400).json({ verified: false, message: "No OTP requested" });

    if (Date.now() > record.expiresAt) {
      otpStore.delete(aadhaarHash);
      return res.status(400).json({ verified: false, message: "OTP expired" });
    }

    // increment attempts and block if too many
    record.attempts = (record.attempts || 0) + 1;
    if (record.attempts > MAX_ATTEMPTS) {
      otpStore.delete(aadhaarHash);
      return res.status(429).json({ verified: false, message: "Too many attempts" });
    }

    // check otp
    if (record.otp === String(otp)) {
      // create short-lived aadhaarToken that proves verification
      const aadhaarToken = makeAadhaarToken();
      // store token with short expiry in map (could be stored in DB or Redis)
      otpStore.set(aadhaarHash, {
        ...record,
        aadhaarToken,
        aadhaarTokenExpiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes token
      });
      // For privacy, delete the raw OTP (no need to keep)
      delete record.otp;

      // Return token to client (client will supply it on register)
      return res.json({ verified: true, aadhaarToken });
    } else {
      // update store with increased attempts
      otpStore.set(aadhaarHash, record);
      return res.status(400).json({ verified: false, message: "Invalid OTP" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Helper endpoint to validate aadhaarToken server-side (used by register)
router.post("/validate-token", (req, res) => {
  try {
    const { aadhaarToken, aadhaarNumber } = req.body;
    if (!aadhaarToken || !aadhaarNumber) return res.status(400).json({ valid: false });

    const aadhaarHash = hashAadhaar(aadhaarNumber);
    const record = otpStore.get(aadhaarHash);
    if (!record || record.aadhaarToken !== aadhaarToken) return res.status(400).json({ valid: false });

    if (Date.now() > (record.aadhaarTokenExpiresAt || 0)) {
      otpStore.delete(aadhaarHash);
      return res.status(400).json({ valid: false, message: "Token expired" });
    }

    // Optionally consume the token (one-time use)
    // otpStore.delete(aadhaarHash);

    return res.json({ valid: true, aadhaarHash });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ valid: false });
  }
});

module.exports = router;
