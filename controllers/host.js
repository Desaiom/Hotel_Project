const Listing = require("../models/listing");
const Booking = require("../models/booking");
const Review = require("../models/reviews");

module.exports.dashboard = async (req, res) => {
  try {
    const hostId = req.user._id;

    // Search & Filter
    const search = req.query.search || "";
    const status = req.query.status || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    // Host listings
    const listings = await Listing.find({ owner: hostId });
    const listingIds = listings.map((listing) => listing._id);

    // All bookings
    let bookings = await Booking.find({
      listing: { $in: listingIds },
    })
      .populate("listing")
      .populate("guest")
      .sort({ createdAt: -1 });

    // Search by guest username
    if (search) {
      bookings = bookings.filter(
        (b) =>
          b.guest &&
          b.guest.username.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by booking status
    if (status) {
      bookings = bookings.filter((b) => b.status === status);
    }

    // Pagination
    const totalBookings = bookings.length;
    const totalPages = Math.ceil(totalBookings / limit);

    const paginatedBookings = bookings.slice(
      (page - 1) * limit,
      page * limit
    );

    // Reviews
    const reviews = await Review.find({
      listing: { $in: listingIds },
    })
      .populate("author")
      .populate("listing");

    // Revenue
    let revenue = 0;

    bookings.forEach((booking) => {
      if (booking.paymentStatus === "paid") {
        revenue += booking.totalPrice;
      }
    });

    // Pending bookings
    const pendingBookings = bookings.filter(
      (booking) => booking.status === "pending"
    );

    // Average rating
    let averageRating = 0;

    if (reviews.length > 0) {
      averageRating =
        reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length;
    }

    // Charts
    const monthlyRevenue = Array(12).fill(0);
    const monthlyBookings = Array(12).fill(0);

    bookings.forEach((booking) => {
      const month = new Date(booking.createdAt).getMonth();

      monthlyBookings[month]++;

      if (booking.paymentStatus === "paid") {
        monthlyRevenue[month] += booking.totalPrice;
      }
    });

    const ratingCount = [0, 0, 0, 0, 0];

    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingCount[review.rating - 1]++;
      }
    });

    const statusData = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };

    bookings.forEach((booking) => {
      if (statusData[booking.status] !== undefined) {
        statusData[booking.status]++;
      }
    });

    res.render("host/dashboard", {
      listings,
      bookings: paginatedBookings,
      reviews,
      revenue,
      averageRating,
      pendingBookings,
      monthlyRevenue,
      monthlyBookings,
      ratingCount,
      statusData,
      search,
      status,
      page,
      totalPages,
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Unable to load dashboard");
    res.redirect("/listings");
  }
};

module.exports.updateBookingStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(id)
        .populate("listing");

    if (!booking) {
        req.flash("error", "Booking not found");
        return res.redirect("/host/dashboard");
    }

    // Security: only the listing owner can update it
    if (!booking.host.equals(req.user._id)) {
        req.flash("error", "Unauthorized");
        return res.redirect("/host/dashboard");
    }

    booking.status = status;

    // Keep payment status unchanged.
    // Only mark payment as refunded if cancelling an already paid booking.
    if (status === "cancelled" && booking.paymentStatus === "paid") {
        booking.paymentStatus = "refunded";
    }

    await booking.save();

    req.flash("success", "Booking status updated");
    res.redirect("/host/dashboard");
};