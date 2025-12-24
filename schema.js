const joi = require('joi');

const artSchema = joi.object({
    art : joi.object ({
        title: joi.string().required(),
        artist: joi.string().required(),
        type: joi.string().required(),
        price: joi.number().required().min(0), // min value should be atleast 0
        image: joi.string().allow("",null), // allows empty string and no value
        medium: joi.string().allow("",null),
        description: joi.string().allow("",null),
        yearCreated: joi.number().allow("",null),
    }).required() // the whole thing should not be empty (so .required)
})

const reviewSchema = joi.object({
    review : joi.object ({
        comment: joi.string().required(),
        rating: joi.number().required().min(1).max(5), // min value should be 1 and max can be 5
        createdAt: joi.number(),
    }).required() // the whole thing should not be empty (so .required)
})

module.exports.artSchema = artSchema;
module.exports.reviewSchema = reviewSchema;