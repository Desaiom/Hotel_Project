const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

module.exports.renderBookingForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    res.render("bookings/new.ejs", { listing });
  } catch (err) {
    next(err);
  }
};

module.exports.createBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    const { checkIn, checkOut, guests } = req.body.booking;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate) || isNaN(checkOutDate)) {
      req.flash("error", "Please provide valid booking dates");
      return res.redirect(`/listings/${id}/book`);
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const pricePerNight = listing.basePrice || listing.price || 0;
    const totalPrice = nights * pricePerNight;

    if (nights < 1) {
      req.flash("error", "Check-out date must be after check-in date");
      return res.redirect(`/listings/${id}/book`);
    }

    if (guests > listing.maxGuests) {
      req.flash("error", "Guest count exceeds listing capacity");
      return res.redirect(`/listings/${id}/book`);
    }

    const overlappingBooking = await Booking.findOne({
      listing: listing._id,
      status: { $ne: "cancelled" },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    });

    if (overlappingBooking) {
      req.flash("error", "Sorry, these dates are already booked");
      return res.redirect(`/listings/${id}/book`);
    }

    const booking = new Booking({
      listing: listing._id,
      guest: req.user._id,
      host: listing.owner,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      nights,
      totalPrice,
    });

    await booking.save();

    if (listing.bookings) {
      listing.bookings.push(booking._id);
      await listing.save();
    }

    req.flash("success", "Booking request created successfully");
    res.redirect(`/bookings/${booking._id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.showBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate("listing")
      .populate("guest", "username email")
      .populate("host", "username email");

    if (!booking) {
      req.flash("error", "Booking not found");
      return res.redirect("/bookings");
    }

    res.render("bookings/show.ejs", { booking });
  } catch (err) {
    next(err);
  }
};

module.exports.listBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ guest: req.user._id })
      .populate("listing")
      .populate("host", "username")
      .sort({ createdAt: -1 });

    res.render("bookings/index.ejs", { bookings });
  } catch (err) {
    next(err);
  }
};

module.exports.cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      req.flash("error", "Booking not found");
      return res.redirect("/bookings");
    }

    if (!booking.guest.equals(req.user._id)) {
      req.flash("error", "You are not authorized to cancel this booking");
      return res.redirect(`/bookings/${id}`);
    }

    booking.status = "cancelled";
    booking.paymentStatus = "refunded";
    await booking.save();

    req.flash("success", "Booking cancelled successfully");
    res.redirect("/bookings");
  } catch (err) {
    next(err);
  }
};
