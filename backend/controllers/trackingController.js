const Customer = require("../models/Customer");
const TrackingLink = require("../models/TrackingLink");

exports.trackClick = async (req, res) => {
  try {
    const { id } = req.params;
    const userAgent = req.headers["user-agent"];
    const ipAddress = req.ip || req.connection.remoteAddress;

    const customer = await Customer.findOne({ trackingId: id });

    if (!customer) {
      return res.status(404).json({ error: "Tracking link not found" });
    }

    const trackingLink = await TrackingLink.findOneAndUpdate(
      { trackingId: id },
      {
        $inc: { clicks: 1 },
        lastClickAt: new Date(),
        $setOnInsert: { firstClickAt: new Date() },
        userAgent,
        ipAddress,
      },
      { upsert: true, new: true }
    );

    await Customer.findByIdAndUpdate(customer._id, {
      status: "opened",
      linkClickedAt: new Date(),
    });

    res.redirect(customer.googleReviewLink);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getTrackingStats = async (req, res) => {
  try {
    const { id } = req.params;

    const tracking = await TrackingLink.findOne({ trackingId: id });

    if (!tracking) {
      return res.status(404).json({ error: "Tracking data not found" });
    }

    const customer = await Customer.findById(tracking.customerId);

    res.json({
      customer: customer.name,
      clicks: tracking.clicks,
      firstClickAt: tracking.firstClickAt,
      lastClickAt: tracking.lastClickAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
