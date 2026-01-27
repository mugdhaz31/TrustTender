const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const sessions = new Map();

// Some random realistic Indian names for test
const mockNames = [
  "Rahul Sharma", "Priya Singh", "Amit Verma", "Neha Patel",
  "Rohan Das", "Kavya Iyer", "Suresh Reddy", "Ananya Nair",
  "Vikas Kumar", "Sneha Mehta"
];

// Generate a random date of birth (between 1980–2004)
function randomDOB() {
  const year = Math.floor(Math.random() * (2004 - 1980 + 1)) + 1980;
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// GET /api/digilocker/auth-url
router.get("/auth-url", (req, res) => {
  const sessionId = crypto.randomBytes(12).toString("hex");
  const mockUrl = `http://localhost:5000/api/digilocker/mock-consent?session=${sessionId}`;
  sessions.set(sessionId, { verified: false });
  res.json({ authUrl: mockUrl });
});

// GET /api/digilocker/mock-consent
router.get("/mock-consent", (req, res) => {
  const { session } = req.query;
  if (!session || !sessions.has(session))
    return res.status(400).send("Invalid session");

  // Generate random mock user data
  const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
  const dob = randomDOB();
  const gender = Math.random() > 0.5 ? "Male" : "Female";
  const aadhaarLast4 = String(Math.floor(1000 + Math.random() * 9000));
  const aadhaarMasked = `XXXX-XXXX-${aadhaarLast4}`;

  const mockData = {
    name: randomName,
    dob,
    gender,
    aadhaarMasked,
    verified: true,
    token: crypto.randomBytes(20).toString("hex"),
  };

  sessions.set(session, mockData);

  // Mock DigiLocker consent UI
  res.send(`
    <html>
      <head>
        <title>DigiLocker Verification</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
          h2 { color: #2c3e50; }
          button {
            padding: 8px 16px; border: none; border-radius: 5px;
            background-color: #2c7be5; color: white; cursor: pointer;
          }
          button:hover { background-color: #1a5fc3; }
        </style>
      </head>
      <body>
        <h2>DigiLocker KYC Verification (Mock)</h2>
        <p>KYC Verified for <b>${mockData.name}</b></p>
        <p>DOB: ${mockData.dob}</p>
        <p>Gender: ${mockData.gender}</p>
        <p>Aadhaar: ${mockData.aadhaarMasked}</p>
        <p><i>(Mock data generated for testing purpose)</i></p>

        <button onclick="finish()">Close & Send Result</button>

        <script>
          function finish() {
            // Post result to parent window
            window.opener.postMessage({
              digilockerResult: {
                aadhaarVerified: true,
                aadhaarHash: "${mockData.aadhaarMasked}",
                name: "${mockData.name}",
                dob: "${mockData.dob}",
                gender: "${mockData.gender}"
              }
            },  "*");
            window.close();
          }
        </script>
      </body>
    </html>
  `);
});

// POST /api/digilocker/verify
router.post("/verify", (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId || !sessions.has(sessionId))
    return res.status(400).json({ verified: false, message: "Invalid session" });

  const data = sessions.get(sessionId);
  if (!data.verified)
    return res.status(400).json({ verified: false, message: "Not verified" });

  res.json({ verified: true, kycData: data });
});

module.exports = router;
