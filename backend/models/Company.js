const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },

  companyType: {
    type: String,
    enum: ["Proprietorship", "Partnership", "LLP", "Private Limited", "Public Limited"],
    required: true,
  },

  gstNumber: { type: String, required: true },
  cinNumber: { type: String },

  officialEmail: { type: String, required: true },
  officialPhone: { type: String, required: true },

  digilockerVerified: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },

  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Company", CompanySchema);
