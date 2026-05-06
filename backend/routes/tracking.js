const express = require("express");
const router = express.Router();
const trackingController = require("../controllers/trackingController");

router.get("/r/:id", trackingController.trackClick);
router.get("/stats/:id", trackingController.getTrackingStats);

module.exports = router;
