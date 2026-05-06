const Customer = require("../models/Customer");
const TrackingLink = require("../models/TrackingLink");

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const { name, phone, googleReviewLink } = req.body;

    if (!name || !phone || !googleReviewLink) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const customer = new Customer({
      name,
      phone: phone.trim(),
      googleReviewLink,
    });

    await customer.save();

    await TrackingLink.create({
      customerId: customer._id,
      trackingId: customer.trackingId,
    });

    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, googleReviewLink, notes } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      id,
      { name, phone, googleReviewLink, notes },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    await TrackingLink.deleteOne({ customerId: id });
    res.json({ message: "Customer deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAsSent = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByIdAndUpdate(
      id,
      { status: "sent", messageSentAt: new Date() },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCustomerStats = async (req, res) => {
  try {
    const total = await Customer.countDocuments();
    const pending = await Customer.countDocuments({ status: "pending" });
    const sent = await Customer.countDocuments({ status: "sent" });
    const opened = await Customer.countDocuments({ status: "opened" });

    res.json({ total, pending, sent, opened });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
