const express = require("express");
const router = express.Router();
const Website = require("../models/Website");
const adminAuth = require("../middleware/adminAuth");

// ─── GET all websites (public) ─────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { status, search, featured } = req.query;
    const filter = {};

    if (status && status !== "all") filter.status = status;
    if (featured === "true") filter.featured = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { techStack: { $elemMatch: { $regex: search, $options: "i" } } },
      ];
    }

    const websites = await Website.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: websites, count: websites.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── GET single website (public) ──────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const website = await Website.findById(req.params.id);
    if (!website) return res.status(404).json({ error: "Website not found" });

    // Increment view count
    website.views += 1;
    await website.save();

    res.json({ success: true, data: website });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    res.status(500).json({ error: error.message });
  }
});

// ─── POST create website (admin only) ─────────────────────────────────────
router.post("/", adminAuth, async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      images,
      techStack,
      liveUrl,
      githubUrl,
      status,
      featured,
      order,
    } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: "Name and description are required" });
    }

    // Get max order to append at end
    const maxOrder = await Website.findOne().sort({ order: -1 }).select("order");
    const newOrder = order !== undefined ? order : (maxOrder ? maxOrder.order + 1 : 0);

    const website = new Website({
      name,
      description,
      shortDescription,
      images: images || [],
      techStack: Array.isArray(techStack) ? techStack : [],
      liveUrl,
      githubUrl,
      status: status || "live",
      featured: featured || false,
      order: newOrder,
    });

    await website.save();
    res.status(201).json({ success: true, data: website });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// ─── PUT update website (admin only) ──────────────────────────────────────
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const allowed = [
      "name", "description", "shortDescription", "images",
      "techStack", "liveUrl", "githubUrl", "status", "featured", "order",
    ];

    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const website = await Website.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!website) return res.status(404).json({ error: "Website not found" });
    res.json({ success: true, data: website });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    res.status(500).json({ error: error.message });
  }
});

// ─── DELETE website (admin only) ──────────────────────────────────────────
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const website = await Website.findByIdAndDelete(req.params.id);
    if (!website) return res.status(404).json({ error: "Website not found" });
    res.json({ success: true, message: "Website deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    res.status(500).json({ error: error.message });
  }
});

// ─── PUT bulk reorder (admin only) ────────────────────────────────────────
router.put("/bulk/reorder", adminAuth, async (req, res) => {
  try {
    const { items } = req.body; // [{ id, order }]
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "items must be an array" });
    }

    const ops = items.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order } },
      },
    }));

    await Website.bulkWrite(ops);
    res.json({ success: true, message: "Order updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
