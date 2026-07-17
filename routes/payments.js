const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const paymentController = require("../controllers/payments.js");

router.post(
  "/bookings/:id/pay",
  isLoggedIn,
  wrapAsync(paymentController.createOrder)
);

router.post(
  "/bookings/:id/verify-payment",
  isLoggedIn,
  wrapAsync(paymentController.verifyPayment)
);

router.get(
  "/bookings/:id/payment-success",
  isLoggedIn,
  wrapAsync(paymentController.paymentSuccess)
);

router.get(
  "/bookings/:id/payment-failure",
  isLoggedIn,
  wrapAsync(paymentController.paymentFailure)
);

router.post("/payments/webhook", wrapAsync(paymentController.webhookHandler));

module.exports = router;
