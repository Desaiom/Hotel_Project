const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews");
const { required } = require("joi");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
    index: true,
  },
  description: String,
  image: {
    // type: String
    url: String,
    filename: String,
  },
  price: {
    type: Number,
    index: true,
  },
  category: {
    type: String,
    default: "General",
    index: true,
  },
  maxGuests: {
    type: Number,
    default: 1,
    min: 1,
    index: true,
  },
  ratingAverage: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  ratingCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  basePrice: {
    type: Number,
    default: 0,
    min: 0,
  },
  location: {
    type: String,
    index: true,
  },
  country: {
    type: String,
    index: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  bookings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

listingSchema.index({ title: "text", location: "text", country: "text" });
listingSchema.index({ category: 1, price: 1 });
listingSchema.index({ category: 1, maxGuests: 1 });
listingSchema.index({ createdAt: -1 });
listingSchema.index({ price: 1, createdAt: -1 });
listingSchema.index({ category: 1, createdAt: -1 });

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
