const express = require("express");
const router = express.Router();

function simulateDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ---------------- COMPANY VERIFICATION ----------------
router.post("/verify-company", async (req, res) => {

  const { gstNumber, cinNumber } = req.body;

  await simulateDelay(1200); // simulate govt latency

  if (!gstNumber) {
    return res.status(400).json({ verified: false });
  }

  // very simple mock rule:
  // if last char of GST is even (0,2,4,6,8) -> verified
  const lastChar = gstNumber[gstNumber.length - 1];

  const isVerified = !isNaN(lastChar) && parseInt(lastChar) % 2 === 0;

  return res.json({
    verified: isVerified,
    source: "Mock-GST-Portal"
  });
});


// ---------------- ORGANIZATION VERIFICATION ----------------
router.post("/verify-organization", async (req, res) => {

  const { registrationId, organizationType } = req.body;

  await simulateDelay(1200);

  if (!registrationId || !organizationType) {
    return res.status(400).json({ verified: false });
  }

  // mock rule:
  // govt org IDs usually start with GOV
  const isVerified = registrationId.startsWith("GOV");

  return res.json({
    verified: isVerified,
    source: "Mock-Gov-Directory"
  });
});

module.exports = router;
