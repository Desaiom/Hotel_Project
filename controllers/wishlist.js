const User = require("../models/user");
const Listing = require("../models/listing");

module.exports.showWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("wishlist");

        res.render("wishlist/index", {
            listings: user.wishlist,
        });
    } catch (err) {
        console.log(err);
        req.flash("error", "Unable to load wishlist.");
        res.redirect("/listings");
    }
};
module.exports.toggleWishlist = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(req.user._id);

        if (user.wishlist.includes(id)) {
            user.wishlist.pull(id);
            req.flash("success", "Removed from wishlist");
        } else {
            user.wishlist.push(id);
            req.flash("success", "Added to wishlist");
        }

        await user.save();

        res.redirect("back");
    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong.");
        res.redirect("/listings");
    }
};

module.exports.removeFromWishlist = async (req, res) => {
    try {
        const { id } = req.params;

        await User.findByIdAndUpdate(req.user._id, {
            $pull: {
                wishlist: id,
            },
        });

        req.flash("success", "Removed from wishlist!");
        res.redirect("back");
    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong.");
        res.redirect("/listings");
    }
};