const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const User = require("../models/user");
const { cloudinary } = require("../cloudConfig");

module.exports.index = async (req, res) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    maxGuests,
    sort,
    page = 1,
  } = req.query;

  const normalizedSearch = typeof search === "string" ? search.trim() : "";
  const escapedSearch = normalizedSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  let query = {};
  let sortQuery = {};

  if (escapedSearch) {
    query.$text = { $search: escapedSearch };
    sortQuery = { score: { $meta: "textScore" } };
  }

  if (category) {
    query.category = category;
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (maxGuests) {
    query.maxGuests = { $gte: Number(maxGuests) };
  }

  if (sort === "price_asc") {
    sortQuery = { price: 1 };
  } else if (sort === "price_desc") {
    sortQuery = { price: -1 };
  } else if (sort === "newest") {
    sortQuery = { createdAt: -1 };
  } else if (sort === "highest_rating") {
    sortQuery = { ratingAverage: -1, ratingCount: -1 };
  } else if (escapedSearch) {
    sortQuery = { score: { $meta: "textScore" } };
  }

  const pageNumber = Math.max(1, Number(page));
  const limit = 10;
  const skip = (pageNumber - 1) * limit;

  const [allListings, totalListings] = await Promise.all([
    Listing.find(query).sort(sortQuery).skip(skip).limit(limit),
    Listing.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalListings / limit);
  let wishlistIds = [];

  if (req.user) {
    const user = await User.findById(req.user._id);
    wishlistIds = user.wishlist.map((id) => id.toString());
  }

  // res.render("listings/index", {
  //   listings,
  //   wishlistIds,
  // });

  res.render("listings/index.ejs", {
    allListings,
    wishlistIds,
    currentPage: pageNumber,
    totalPages,
    hasPrevPage: pageNumber > 1,
    hasNextPage: pageNumber < totalPages,
    search: normalizedSearch,
    category,
    minPrice,
    maxPrice,
    maxGuests,
    sort,
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let wishlistIds = [];

  if (req.user) {
    const user = await User.findById(req.user._id);
    wishlistIds = user.wishlist.map((id) => id.toString());
  }
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Hotel you requested for does not exists!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing, wishlistIds });
};

module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  // console.log(response.body.features[0].geometry);
  // let url = req.file.path;
  // let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  newListing.geometry = response.body.features[0].geometry;

  await newListing.save();
  req.flash("success", "New Hotel Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Hotel you requested for does not exists!");
    res.redirect("/listings");
  }

  let orgImageUrl =
    listing.images?.length > 0
      ? listing.images[0].url.replace("/upload", "/upload/w_250")
      : "";
  res.render("listings/edit.ejs", { listing, orgImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true },
  );

  // Upload new images
  if (req.files && req.files.length > 0) {
    const imgs = req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));

    listing.images.push(...imgs);
    await listing.save();
  }

  // Delete selected images
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }

    await Listing.findByIdAndUpdate(id, {
      $pull: {
        images: {
          filename: {
            $in: req.body.deleteImages,
          },
        },
      },
    });
  }

  req.flash("success", "Hotel Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  for (const image of listing.images) {
    await cloudinary.uploader.destroy(image.filename);
  }

  const deleted = await Listing.findByIdAndDelete(id);
  console.log(deleted);
  req.flash("success", "Hotel Deleted!");
  res.redirect("/listings");
};
