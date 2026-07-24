const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwnerOrAdmin, validateListing, isHost } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    isHost,
    upload.array("listing[images]", 6),
    validateListing,
    wrapAsync(listingController.createListing)
  );
 
//New Route
router.get("/new", isLoggedIn, isHost, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,isHost,
    // isOwnerOrAdmin,
    upload.array("listing[images]", 6),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwnerOrAdmin, wrapAsync(listingController.destroyListing));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwnerOrAdmin,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
