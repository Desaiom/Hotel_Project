const Booking = require("../models/booking.js");
const razorpay = require("../config/razorpay.js");
const crypto = require("crypto");
const { isAdmin } = require("../utils/roles.js");

module.exports.createOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      req.flash("error", "Booking not found");
      return res.redirect("/bookings");
    }

    if (!isAdmin(req.user) && !booking.guest.equals(req.user._id)) {
      req.flash("error", "You are not authorized to pay for this booking");
      return res.redirect(`/bookings/${id}`);
    }

    if (booking.paymentStatus === "paid") {
      req.flash("error", "Booking is already paid");
      return res.redirect(`/bookings/${id}`);
    }

    const options = {
      amount: booking.totalPrice * 100,
      currency: "INR",
      receipt: booking._id.toString(),
      notes: {
        bookingId: booking._id.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    booking.razorpayOrderId = order.id;
    booking.paymentAmount = booking.totalPrice;
    booking.paymentCurrency = "INR";
    booking.paymentStatus = "pending";
    await booking.save();

    res.json({
      success: true,
      order,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
      userName: req.user.username,
      userEmail: req.user.email,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.verifyPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const booking = await Booking.findById(id);

    if (!booking) {
      req.flash("error", "Booking not found");
      return res.redirect("/bookings");
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      booking.paymentStatus = "failed";
      await booking.save();
      req.flash("error", "Payment verification failed");
      return res.redirect(`/bookings/${id}/payment-failure`);
    }

    booking.razorpayPaymentId = razorpay_payment_id;
    booking.razorpaySignature = razorpay_signature;
    booking.paymentStatus = "paid";
    booking.status = "confirmed";
    booking.paymentCapturedAt = new Date();
    await booking.save();

    req.flash("success", "Payment successful");
    res.redirect(`/bookings/${id}/payment-success`);
  } catch (err) {
    next(err);
  }
};

module.exports.paymentSuccess = async (req, res) => {
  const { id } = req.params;
  req.flash("success", "Payment successful");
  res.redirect(`/bookings/${id}`);
};

module.exports.paymentFailure = async (req, res) => {
  const { id } = req.params;
  req.flash("error", "Payment failed");
  res.redirect(`/bookings/${id}`);
};

module.exports.webhookHandler = async (req, res, next) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    if (!webhookSecret || !signature) {
      return res
        .status(400)
        .json({ message: "Missing webhook secret or signature" });
    }

    const rawBody =
      req.rawBody ||
      (Buffer.isBuffer(req.body)
        ? req.body.toString("utf8")
        : typeof req.body === "string"
          ? req.body
          : JSON.stringify(req.body));

    const generatedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (generatedSignature !== signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const event = req.body?.event;
    const paymentEntity = req.body?.payload?.payment?.entity;
    const refundEntity = req.body?.payload?.refund?.entity;
    const bookingId =
      paymentEntity?.notes?.bookingId ||
      refundEntity?.notes?.bookingId ||
      req.body?.payload?.payment?.entity?.notes?.bookingId;

    if (!bookingId) {
      return res.status(400).json({ message: "Missing booking reference" });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("Razorpay webhook received", {
      event,
      bookingId,
      paymentId: paymentEntity?.id || refundEntity?.id,
    });

    if (event === "payment.captured") {
      booking.paymentStatus = "paid";
      booking.status = "confirmed";
      booking.razorpayPaymentId =
        paymentEntity?.id || booking.razorpayPaymentId;
      booking.razorpayOrderId =
        paymentEntity?.order_id || booking.razorpayOrderId;
      booking.paymentCapturedAt = paymentEntity?.created_at
        ? new Date(paymentEntity.created_at * 1000)
        : new Date();
      await booking.save();
      console.log(
        "Booking updated for payment.captured",
        booking._id.toString(),
      );
    }

    if (event === "payment.failed") {
      booking.paymentStatus = "failed";
      booking.status = "pending";
      await booking.save();
      console.log("Booking updated for payment.failed", booking._id.toString());
    }

    if (event === "refund.created") {
      booking.paymentStatus = "refunded";
      booking.status = "cancelled";
      await booking.save();
      console.log("Booking updated for refund.created", booking._id.toString());
    }

    return res.status(200).json({ ok: true, received: true });
  } catch (err) {
    console.error("Webhook processing failed", err);
    return res.status(500).json({ message: "Webhook processing failed" });
  }
};
