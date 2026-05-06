const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      match: /^[\d\+\-\(\)\s]+$/,
    },
    googleReviewLink: {
      type: String,
      required: true,
    },
    trackingId: {
      type: String,
      unique: true,
      default: uuidv4,
    },
    status: {
      type: String,
      enum: ["pending", "opened", "sent"],
      default: "pending",
    },
    messageSentAt: Date,
    linkClickedAt: Date,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
