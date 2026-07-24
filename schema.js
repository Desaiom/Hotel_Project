const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
    }).required(),
    deleteImages: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
).optional()
   
});

module.exports.listingQuerySchema = Joi.object({
    search: Joi.string().trim().max(100).allow(""),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    category: Joi.string().trim().valid("Beach House", "Mountain Cabin", "City Stay", "Villa", "General").allow(""),
    sort: Joi.string().trim().valid("price_asc", "price_desc", "newest", "highest_rating", "").allow(""),
    maxGuests: Joi.number().integer().min(1),
    guest: Joi.string().allow(""),
}).custom((value, helpers) => {
    if (value.minPrice != null && value.maxPrice != null && value.minPrice > value.maxPrice) {
        return helpers.error("any.invalid");
    }
    return value;
});

module.exports.reviewSchema = Joi.object({
    review :Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});
