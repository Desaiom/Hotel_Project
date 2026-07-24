const express = require("express");
const router = express.Router();

const wishlistController = require("../controllers/wishlist");
const { isLoggedIn,isUser } = require("../middleware");

router.get("/", isLoggedIn,isUser, wishlistController.showWishlist);
router.post("/:id", isLoggedIn,isUser, wishlistController.toggleWishlist);
router.delete("/:id", isLoggedIn,isUser, wishlistController.removeFromWishlist);

module.exports = router;