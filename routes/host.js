const express = require("express");

const router = express.Router();

const hostController = require("../controllers/host");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isHost } = require("../middleware");

router.get(
    "/dashboard",
    isLoggedIn,
    isHost,
    hostController.dashboard
);
router.put(
    "/bookings/:id/status",
    isLoggedIn,
    isHost,
    wrapAsync(hostController.updateBookingStatus)
);
module.exports = router;