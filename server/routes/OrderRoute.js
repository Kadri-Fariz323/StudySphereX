const express = require("express");
const router = express.Router();

const { createOrder, capturePaymentAndFinalizeOrder } = require('../controller/orderController')

router.post("/create", createOrder);
router.post("/capture", capturePaymentAndFinalizeOrder);

module.exports = router;
