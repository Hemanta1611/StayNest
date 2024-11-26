const Joi = require("joi");

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string(), // Optional since it's not required in Mongoose schema
        image: Joi.object({
            filename: Joi.string().required(),
            url: Joi.string().uri().required(), // Validate URL format
        }).optional(), // Optional because Mongoose has a default value
        price: Joi.number().min(0).required(), // Ensure price is non-negative
        location: Joi.string().required(),
        country: Joi.string().required(),
    }).required(),
});

module.exports = listingSchema;
