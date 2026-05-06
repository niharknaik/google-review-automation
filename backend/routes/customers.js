const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.get("/", customerController.getAllCustomers);
router.post("/", customerController.createCustomer);
router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);
router.patch("/:id/mark-sent", customerController.markAsSent);
router.get("/stats/overview", customerController.getCustomerStats);

module.exports = router;
