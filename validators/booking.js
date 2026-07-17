const Joi = require("joi");

module.exports.bookingSchema = Joi.object({
  booking: Joi.object({
    checkIn: Joi.date().required().greater("now").messages({
      "date.base": "Check-in date must be a valid date",
      "date.greater": "Check-in date must be in the future",
      "any.required": "Check-in date is required",
    }),
    checkOut: Joi.date().required().greater(Joi.ref("checkIn")).messages({
      "date.base": "Check-out date must be a valid date",
      "date.greater": "Check-out date must be after check-in date",
      "any.required": "Check-out date is required",
    }),
    guests: Joi.number().required().min(1).messages({
      "number.base": "Guests must be a number",
      "number.min": "Guests must be at least 1",
      "any.required": "Guests are required",
    }),
  }).required(),
});
