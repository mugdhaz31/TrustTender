const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },

  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },

  passwordHash: { type: String, required: true },

  role: {
    type: String,
    enum: ["TENDER_OFFICER", "VENDOR"],
    required: true,
  },

  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
  },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },

  aadhaarHash: { type: String },
  aadhaarVerified: { type: Boolean, default: false },

  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
