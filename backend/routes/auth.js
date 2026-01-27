// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const Organization = require("../models/Organization");
const Company = require("../models/Company");
const axios = require("axios"); // for internal validate call if desired


const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "secret";

function hashAadhaar(aadhaar) {
  const hmac = crypto.createHmac("sha256", process.env.AADHAAR_HMAC_SECRET || "demo_secret");
  hmac.update(aadhaar);
  return hmac.digest("hex");
}

// REGISTER
// Expect: { fullName, email, phoneNumber, password, role, organizationName, companyName, aadhaarToken, aadhaarNumber(optional) }
router.post("/register", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      password,
      role,

      organizationName,
      companyName,

      emailVerified,
      phoneVerified,
      aadhaarVerified,

      aadhaarToken,
      aadhaarNumber,
    } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!emailVerified || !phoneVerified || !aadhaarVerified) {
      return res.status(400).json({
        message: "Email, Phone and Aadhaar verification required",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    let organizationId = null;
    let companyId = null;

    // ---------------- TENDER OFFICER ----------------
    // ---------------- TENDER OFFICER ----------------
    if (role === "TENDER_OFFICER") {
      if (!organizationName) return res.status(400).json({ message: "Organization name required" });

      const org = await Organization.create({
        name: organizationName,
        organizationType: req.body.organizationType || "Government", // new field
        registrationId: req.body.registrationId || "",              // new field
        officialEmail: email,
        officialPhone: phoneNumber,
        emailVerified: true,
        phoneVerified: true,
      });

      organizationId = org._id;
    }

    // ---------------- VENDOR ----------------
    if (role === "VENDOR") {
      if (!companyName) return res.status(400).json({ message: "Company name required" });

      const company = await Company.create({
        name: companyName,
        companyType: req.body.companyType || "Private Limited", // new field
        gstNumber: req.body.gstNumber || "PENDING",            // new field
        cinNumber: req.body.cinNumber || "",                   // new field
        officialEmail: email,
        officialPhone: phoneNumber,
        emailVerified: true,
        phoneVerified: true,
      });

      companyId = company._id;
    }


    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      fullName,
      email,
      phoneNumber,
      passwordHash,
      role,
      organizationId,
      companyId,
      aadhaarVerified,
      emailVerified,
      phoneVerified,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// LOGIN stays the same (no changes needed)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
