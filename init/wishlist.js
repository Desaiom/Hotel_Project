const User = require("../models/user");

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seedWishlist(users, listings) {
  console.log("🧹 Clearing old wishlists...");

  // Reset wishlist arrays
  await User.updateMany(
    {},
    {
      $set: {
        wishlist: [],
      },
    }
  );

  for (const user of users) {
    const wishlistSize = random(3, 6);

    const selectedListings = [];

    while (selectedListings.length < wishlistSize) {
      const listing =
        listings[random(0, listings.length - 1)];

      const exists = selectedListings.some((item) =>
        item._id.equals(listing._id)
      );

      if (!exists) {
        selectedListings.push(listing);
      }
    }

    user.wishlist = selectedListings.map(
      (listing) => listing._id
    );

    await user.save();
  }

  console.log("❤️ Wishlists created successfully");

  return users;
}

module.exports = seedWishlist;