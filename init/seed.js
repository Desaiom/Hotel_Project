const mongoose = require("mongoose");
require("dotenv").config();

const seedUsers = require("./users");
const seedListings = require("./data");
const seedReviews = require("./reviews");
const seedBookings = require("./bookings");
const seedWishlist = require("./wishlist");

const dbUrl = process.env.ATLASDB_URL;


async function seedDatabase() {
  try {
    await mongoose.connect(dbUrl);

    console.log("✅ MongoDB Connected");

    // 1. Users
    const {
      admin,
      hosts,
      guests,
      users,
    } = await seedUsers();


    // 2. Listings
    const listings = await seedListings(hosts);


    // 3. Reviews
    await seedReviews(
      [...hosts, ...guests],
      listings
    );


    // 4. Bookings
    await seedBookings(
      [...guests, ...hosts],
      listings
    );


    // 5. Wishlist
    await seedWishlist(
      [...guests],
      listings
    );


    console.log("==============================");
    console.log("🎉 DATABASE SEEDED SUCCESSFULLY");
    console.log("==============================");


    await mongoose.connection.close();

    process.exit(0);

  } catch (error) {

    console.log("❌ Seed Error");
    console.log(error);

    await mongoose.connection.close();

    process.exit(1);
  }
}


seedDatabase();