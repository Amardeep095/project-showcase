const adminAuth = (req, res, next) => {
  const token = req.headers["x-admin-token"];

  if (!token) {
    return res.status(401).json({ error: "No admin token provided" });
  }

  // Simple token = base64 of password
  let decoded;
  try {
    decoded = Buffer.from(token, "base64").toString("utf8");
  } catch {
    return res.status(401).json({ error: "Invalid token format" });
  }

  if (decoded !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid admin credentials" });
  }

  next();
};

module.exports = adminAuth;
