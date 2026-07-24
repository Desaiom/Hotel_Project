const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const { isLoggedIn } = require("../middleware.js");
const profileController = require("../controllers/profile.js");
const bookingController = require("../controllers/bookings.js");

router.get("/profile", isLoggedIn, wrapAsync(profileController.showProfile));
router.get("/profile/edit", isLoggedIn, wrapAsync(profileController.editProfileForm));
router.put("/profile", isLoggedIn, wrapAsync(profileController.updateProfile));
router.post(
  "/profile/avatar",
  isLoggedIn,
  upload.single("avatar"),
  wrapAsync(profileController.uploadAvatar)
);
router.get(
  "/bookings",
  isLoggedIn,
  wrapAsync(profileController.myBookings)
);

router.get(
  "/profile/listings",
  isLoggedIn,
  wrapAsync(profileController.myListings)
);

router.get(
  "/profile/reviews",
  isLoggedIn,
  wrapAsync(profileController.myReviews)
);
module.exports = router;

router.put(
    "/bookings/:id/cancel",
    isLoggedIn,
    wrapAsync(bookingController.cancelBooking)
);
