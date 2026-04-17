const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const adminAuth = require("../middleware/adminAuth");

// Use memory storage so we can stream to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, png, webp, gif)"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder = "showcase") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// POST /api/upload - single image (admin only)
router.post("/", adminAuth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    if (error.message?.includes("Only image")) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Upload failed: " + error.message });
  }
});

// POST /api/upload/multiple - multiple images (admin only)
router.post("/multiple", adminAuth, upload.array("images", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No image files provided" });
    }

    const uploads = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer))
    );

    res.json({
      success: true,
      urls: uploads.map((r) => r.secure_url),
      publicIds: uploads.map((r) => r.public_id),
    });
  } catch (error) {
    res.status(500).json({ error: "Upload failed: " + error.message });
  }
});

// Multer error handler
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large. Max 5MB." });
    }
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

module.exports = router;
