const Joi = require("joi");
const ExpressError = require("../utils/ExpressErr");

const profileSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(60).messages({
    "string.min": "Full name must be at least 2 characters long",
    "string.max": "Full name cannot exceed 60 characters",
    "string.empty": "Full name is required",
  }),
  bio: Joi.string().trim().max(160).allow("").messages({
    "string.max": "Bio cannot exceed 160 characters",
  }),
  phone: Joi.string().trim().pattern(/^[+]?([0-9\s-]{7,15})$/).allow("").messages({
    "string.pattern.base": "Please enter a valid phone number",
  }),
  location: Joi.string().trim().max(80).allow("").messages({
    "string.max": "Location cannot exceed 80 characters",
  }),
});

module.exports.validateProfile = (req, res, next) => {
  const { error } = profileSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    return next(new ExpressError(400, errMsg));
  }
  next();
};
