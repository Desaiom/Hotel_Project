const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const bookingController = require("../controllers/bookings.js");

router.get("/bookings", isLoggedIn, wrapAsync(bookingController.listBookings));

router.get(
  "/listings/:id/book",
  isLoggedIn,
  wrapAsync(bookingController.renderBookingForm)
);

router.post(
  "/listings/:id/bookings",
  isLoggedIn,
  wrapAsync(bookingController.createBooking)
);

router.get(
  "/bookings/:id",
  isLoggedIn,
  wrapAsync(bookingController.showBooking)
);

router.delete(
  "/bookings/:id",
  isLoggedIn,
  wrapAsync(bookingController.cancelBooking)
);

module.exports = router;
