require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const customerRoutes = require("./routes/customers");
const trackingRoutes = require("./routes/tracking");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/customers", customerRoutes);
app.use("/api/tracking", trackingRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
