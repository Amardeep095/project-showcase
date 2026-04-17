const express = require("express");
const router = express.Router();

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: "Server misconfigured" });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid password" });
  }

  // Create a simple token = base64(password)
  const token = Buffer.from(password).toString("base64");

  res.json({
    success: true,
    token,
    message: "Login successful",
  });
});

// POST /api/auth/verify
router.post("/verify", (req, res) => {
  const token = req.headers["x-admin-token"];

  if (!token) {
    return res.status(401).json({ valid: false });
  }

  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    if (decoded === process.env.ADMIN_PASSWORD) {
      return res.json({ valid: true });
    }
    return res.status(401).json({ valid: false });
  } catch {
    return res.status(401).json({ valid: false });
  }
});

module.exports = router;
