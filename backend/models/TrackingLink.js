const mongoose = require("mongoose");

const trackingLinkSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    trackingId: {
      type: String,
      required: true,
      unique: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    firstClickAt: Date,
    lastClickAt: Date,
    userAgent: String,
    ipAddress: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrackingLink", trackingLinkSchema);
