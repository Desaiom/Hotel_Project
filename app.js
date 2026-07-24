if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

 
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressErr.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { isAdmin, canManageListings, getUserRole } = require("./utils/roles.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const bookingRouter = require("./routes/bookings.js");
const paymentRouter = require("./routes/payments.js");
const profileRouter = require("./routes/profile.js");
const hostRouter = require("./routes/host");
const wishlistRouter = require("./routes/wishlist");

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
const razorpayWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

const dburl = process.env.ATLASDB_URL;


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dburl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl : dburl,
    crypto: {
        secret: process.env.SECRET,      
    },
    touchAfter: 24 * 3600,
});

store.on("error",(err)=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  res.locals.isAdmin = isAdmin(req.user);
  res.locals.canManageListings = canManageListings(req.user);
  res.locals.userRole = getUserRole(req.user);
  next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/", bookingRouter);
app.use("/", paymentRouter);
app.use("/", profileRouter);
app.use("/host", hostRouter);
app.use("/wishlist", wishlistRouter);

app.get("/favicon.ico", (req, res) => res.status(204).end());
app.get("/", (req, res) => {
  res.render("listings/index.ejs");
});
app.all("*", (req, res, next) => {
  console.log("404:", req.method, req.originalUrl);
  next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, msg = "Something went wrong" } = err;
  console.error(err);
  res.status(statusCode).render("listings/error.ejs", { msg });
});

app.listen(3000, () => {
  console.log("server is listening to port 3000");
});
