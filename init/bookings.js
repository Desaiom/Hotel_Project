const Booking = require("../models/booking");

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const bookingStatus = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

const paymentStatus = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

async function seedBookings(users, listings) {
  console.log("🧹 Removing old bookings...");

  await Booking.deleteMany({});

  const bookings = [];

  // users are normal users only
  // hosts are listing owners

  for (let i = 0; i < 25; i++) {
    const listing = listings[random(0, listings.length - 1)];

    const guest = users[random(0, users.length - 1)];

    // don't allow host to book own listing
    if (guest._id.equals(listing.owner)) {
      i--;
      continue;
    }

    const nights = random(1, 7);

    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + random(-20, 20));

    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + nights);

    const totalPrice = listing.price * nights;

    const booking = await Booking.create({
      listing: listing._id,
      guest: guest._id,
      host: listing.owner,

      checkIn,
      checkOut,

      guests: random(1, listing.maxGuests),

      nights,

      totalPrice,

      status: bookingStatus[random(0, bookingStatus.length - 1)],

      paymentStatus:
        paymentStatus[random(0, paymentStatus.length - 1)],

      paymentAmount: totalPrice,

      paymentCurrency: "INR",

      razorpayOrderId: `order_${Date.now()}_${i}`,

      razorpayPaymentId: `pay_${Date.now()}_${i}`,

      razorpaySignature: `signature_${i}`,
    });

    bookings.push(booking);

    listing.bookings.push(booking._id);

    guest.bookingsMade.push(booking._id);

    const hostUser = users.find((u) => u._id.equals(listing.owner));

    if (hostUser) {
      hostUser.bookingsReceived.push(booking._id);
    }

    await listing.save();
    await guest.save();

    if (hostUser) {
      await hostUser.save();
    }
  }

  console.log(`✅ ${bookings.length} bookings created`);

  return bookings;
}

module.exports = seedBookings;