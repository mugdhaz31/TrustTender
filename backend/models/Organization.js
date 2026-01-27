const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  organizationType: {
    type: String,
    enum: ["Government", "PSU", "Private"],
    required: true,
  },

  officialEmail: { type: String, required: true },
  officialPhone: { type: String, required: true },

  registrationId: { type: String }, // Govt Reg No / Dept ID
  digilockerVerified: { type: Boolean, default: false },

  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Organization", OrganizationSchema);
