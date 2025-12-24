const express = require("express");
const mongoose = require("mongoose");
const user = require("./user.js")

const Schema = mongoose.Schema; // just so that we don't have to write mongoose.Schema every time, now we can just write Schema at those places



const reviewSchema = new Schema({
    comment: {
        type: String
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

const review = mongoose.model("review", reviewSchema);
module.exports = review;