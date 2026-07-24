const Listing = require("./models/listing");
const Booking = require("./models/booking");
const { listingSchema, reviewSchema, listingQuerySchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressErr.js");
const Review = require("./models/reviews.js");
const { isAdmin, canManageListings,isUserRole } = require("./utils/roles");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to continue!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isHost = (req, res, next) => {
  if (!canManageListings(req.user)) {
    console.log(req.user.role);
    req.flash("error", "You must be a Host to manage listings.");
    return res.redirect("/host/dashboard");
  }
  next();
};

module.exports.isAdmin = (req, res, next) => {
  if (!isAdmin(req.user)) {
    req.flash("error", "Admin access required.");
    return res.redirect("/listings");
  }
  next();
};

module.exports.isOwnerOrAdmin = async (req, res, next) => {
  if (isAdmin(req.user)) {
    return next();
  }

  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Hotel not found.");
    return res.redirect("/listings");
  }

  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You are not the owner of this hotel.");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

module.exports.isOwner = module.exports.isOwnerOrAdmin;

module.exports.isBookingParticipantOrAdmin = async (req, res, next) => {
  const { id } = req.params;
  const booking = await Booking.findById(id);

  if (!booking) {
    req.flash("error", "Booking not found.");
    return res.redirect("/bookings");
  }

  if (isAdmin(req.user)) {
    return next();
  }

  const isGuest = booking.guest.equals(req.user._id);
  const isHost = booking.host.equals(req.user._id);

  if (!isGuest && !isHost) {
    req.flash("error", "You are not authorized to view this booking.");
    return res.redirect("/bookings");
  }

  next();
};

module.exports.isBookingManagerOrAdmin = async (req, res, next) => {
  const { id } = req.params;
  const booking = await Booking.findById(id);

  if (!booking) {
    req.flash("error", "Booking not found.");
    return res.redirect("/bookings");
  }

  if (isAdmin(req.user)) {
    return next();
  }

  const isGuest = booking.guest.equals(req.user._id);
  const isHost = booking.host.equals(req.user._id);

  if (!isGuest && !isHost) {
    req.flash("error", "You are not authorized to manage this booking.");
    return res.redirect("/bookings");
  }

  next();
};

module.exports.isBookingGuestOrAdmin = async (req, res, next) => {
  const { id } = req.params;
  const booking = await Booking.findById(id);

  if (!booking) {
    req.flash("error", "Booking not found.");
    return res.redirect("/bookings");
  }

  if (isAdmin(req.user) || booking.guest.equals(req.user._id)) {
    return next();
  }

  req.flash("error", "You are not authorized to pay for this booking.");
  return res.redirect(`/bookings/${id}`);
};

// module.exports.validateListing = (req, res, next) => {
//   const { error } = listingSchema.validate(req.body);
//   if (error) {
//     const errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   }
//   next();
// };
module.exports.validateListing = (req, res, next) => {
    if (req.body.deleteImages && !Array.isArray(req.body.deleteImages)) {
        req.body.deleteImages = [req.body.deleteImages];
    }

    const { error } = listingSchema.validate(req.body);

    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }

    next();
};
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

module.exports.validateListingQuery = (req, res, next) => {
  const { error } = listingQuerySchema.validate(req.query, { abortEarly: false });
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

module.exports.isReviewAuthorOrAdmin = async (req, res, next) => {
  if (isAdmin(req.user)) {
    return next();
  }

  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review not found.");
    return res.redirect(`/listings/${id}`);
  }

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not the author of this review.");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
module.exports.isUser = (req, res, next) => {
  if (!isUserRole(req.user)) {
    req.flash("error", "Only users can perform this action.");
    return res.redirect("/listings");
  }

  next();
};
module.exports.isReviewAuthor = module.exports.isReviewAuthorOrAdmin;
