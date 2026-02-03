require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const aadhaarRoutes = require("./routes/aadhaar");
const emailRoutes = require("./routes/email");
const digilockerRoutes = require("./routes/digilocker");
const phoneRoutes = require("./routes/phone");
const govSimulatorRoutes = require("./routes/govSimulator");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/phone", phoneRoutes);
app.use("/api/aadhaar", aadhaarRoutes);
app.use("/api/digilocker", digilockerRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/gov", govSimulatorRoutes);

// connect MongoDB
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
