const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const { ROLES } = require("../utils/roles");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.USER,
  },
  fullName: {
    type: String,
    trim: true,
    minlength: [2, "Full name must be at least 2 characters long"],
    maxlength: [60, "Full name cannot exceed 60 characters"],
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [160, "Bio cannot exceed 160 characters"],
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[+]?([0-9\s-]{7,15})$/, "Please enter a valid phone number"],
  },
  location: {
    type: String,
    trim: true,
    maxlength: [80, "Location cannot exceed 80 characters"],
  },
  avatar: {
    url: {
      type: String,
      trim: true,
    },
    filename: {
      type: String,
      trim: true,
    },
  },
  bookingsMade: [
    {
      type: Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
  bookingsReceived: [
    {
      type: Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
    },
  ],
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
