const Review = require("../models/reviews");

const comments = [
  "Amazing stay! Highly recommended.",
  "Very clean and comfortable.",
  "Fantastic location with beautiful views.",
  "Host was very friendly and helpful.",
  "Would definitely visit again.",
  "Perfect for a family vacation.",
  "Worth every penny.",
  "Peaceful and relaxing atmosphere.",
  "Everything was exactly as described.",
  "Excellent amenities and service.",
  "Loved the interiors and cleanliness.",
  "Great experience overall.",
  "Beautiful property and great hospitality.",
  "Nice place for a weekend getaway.",
  "One of the best stays I've had.",
];

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seedReviews(users, listings) {
  console.log("🧹 Removing old reviews...");

  await Review.deleteMany({});

  const reviews = [];

  for (const listing of listings) {

    // Clear existing review references
    listing.reviews = [];

    const reviewCount = random(2, 5);

    let totalRating = 0;

    for (let i = 0; i < reviewCount; i++) {

      const author = users[random(0, users.length - 1)];

      const rating = random(3, 5);

      totalRating += rating;

      const review = await Review.create({
        comment: comments[random(0, comments.length - 1)],
        rating,
        author: author._id,
        listing: listing._id,          // ⭐ NEW
      });

      listing.reviews.push(review._id);

      reviews.push(review);
    }

    listing.ratingAverage = Number(
      (totalRating / reviewCount).toFixed(1)
    );

    listing.ratingCount = reviewCount;

    await listing.save();
  }

  console.log(`✅ ${reviews.length} Reviews Created`);

  return reviews;
}

module.exports = seedReviews;