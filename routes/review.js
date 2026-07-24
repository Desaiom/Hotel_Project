const express = require("express");
const router = express.Router({ mergeParams: true }); //IMP
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErr.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor ,isUser} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//Reviews
//Post Route
router.post(
  "/",
  isLoggedIn,
  isUser,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isUser,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;


