const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isBookingParticipantOrAdmin, isBookingManagerOrAdmin ,isUser} = require("../middleware.js");
const bookingController = require("../controllers/bookings.js");

router.get("/bookings", isLoggedIn, wrapAsync(bookingController.listBookings));

router.get(
  "/listings/:id/book",
  isLoggedIn,isUser,
  wrapAsync(bookingController.renderBookingForm)
);

router.post(
  "/listings/:id/bookings",
  isLoggedIn,isUser,
  wrapAsync(bookingController.createBooking)
);

router.get(
  "/bookings/:id",
  isLoggedIn,
  isBookingParticipantOrAdmin,
  wrapAsync(bookingController.showBooking)
);

router.delete(
  "/bookings/:id",
  isLoggedIn,
  isBookingManagerOrAdmin,
  wrapAsync(bookingController.cancelBooking)
);

module.exports = router;
