const mongoose = require("mongoose");

const websiteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [200, "Short description cannot exceed 200 characters"],
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 10,
        message: "Cannot have more than 10 images",
      },
    },
    techStack: {
      type: [String],
      default: [],
    },
    liveUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || /^https?:\/\/.+/.test(v),
        message: "Live URL must be a valid URL",
      },
    },
    githubUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || /^https?:\/\/.+/.test(v),
        message: "GitHub URL must be a valid URL",
      },
    },
    status: {
      type: String,
      enum: ["live", "beta", "archived", "wip"],
      default: "live",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for sorting
websiteSchema.index({ order: 1, createdAt: -1 });

module.exports = mongoose.model("Website", websiteSchema);
