const User = require("../models/user");
const { cloudinary } = require("../cloudConfig");

module.exports.showProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/listings");
    }

    const Listing = require("../models/listing");
    const Booking = require("../models/booking");
    const Review = require("../models/reviews");

    const [totalListings, totalBookings, totalReviews] = await Promise.all([
      Listing.countDocuments({ owner: user._id }),
      Booking.countDocuments({ guest: user._id }),
      Review.countDocuments({ author: user._id }),
    ]);

    res.render("profile/index.ejs", {
      user,
      totalListings,
      totalBookings,
      totalReviews,
    });
  } catch (err) {
    req.flash("error", "Failed to load profile.");
    res.redirect("/listings");
  }
};

module.exports.editProfileForm = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/listings");
    }

    res.render("profile/edit.ejs", { user });
  } catch (err) {
    req.flash("error", "Could not load profile editor.");
    res.redirect("/listings");
  }
};

module.exports.updateProfile = async (req, res) => {
  try {
    const { fullName, bio, phone, location } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/listings");
    }

    user.fullName = fullName || "";
    user.bio = bio || "";
    user.phone = phone || "";
    user.location = location || "";

    await user.save();
    req.flash("success", "Profile updated successfully!");
    res.redirect("/profile");
  } catch (err) {
    req.flash("error", "Profile update failed.");
    res.redirect("/profile/edit");
  }
};

module.exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      req.flash("error", "Please choose an image to upload.");
      return res.redirect("/profile");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/listings");
    }

    const previousAvatar = user.avatar && user.avatar.filename ? user.avatar.filename : null;
    const newAvatarData = {
      url: req.file.path || req.file.secure_url || "",
      filename: req.file.filename,
    };

    user.avatar = newAvatarData;

    try {
      await user.save();
      req.flash("success", "Avatar updated successfully!");
    } catch (saveErr) {
      try {
        await cloudinary.uploader.destroy(newAvatarData.filename);
      } catch (cleanupErr) {
        console.error("Failed to clean up newly uploaded avatar:", cleanupErr);
      }
      console.error("Avatar save failed:", saveErr);
      req.flash("error", "Avatar upload failed.");
      return res.redirect("/profile");
    }

    if (previousAvatar && previousAvatar !== newAvatarData.filename) {
      try {
        await cloudinary.uploader.destroy(previousAvatar);
      } catch (deleteErr) {
        console.error("Failed to delete previous avatar:", deleteErr);
      }
    }

    return res.redirect("/profile");
  } catch (err) {
    console.error("Avatar upload failed:", err);
    req.flash("error", "Avatar upload failed.");
    return res.redirect("/profile");
  }
};
