const express = require("express");

const mongoose = require("mongoose");
const review = require("./review.js")

const Schema = mongoose.Schema; // just so that we don't have to write mongoose.Schema every time, now we can just write Schema at those places



const artSchema = new Schema({
    title: {
        type: String,
    },
    artist: {
        type: String,
    },
    type: {
        type: String,
        enum: ['Paintings', 'Photograph', 'Sculpture', 'Digital Art', 'Mixed Media', 'Other'],
        default: 'Paintings'
    },
    price: {
        type: Number,
        min: 0,
    },
    image: {
        url: String,
        filename: String

        // type: String, // store URL of the artwork
        // default: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGFpbnRpbmd8ZW58MHx8MHx8fDA%3D",
        // set: v => v === '' ? "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGFpbnRpbmd8ZW58MHx8MHx8fDA%3D" : v
    },
    yearCreated: {
        type: Number,
        default: new Date().getFullYear()
    },
    medium: {
        type: String, 
        default: "Oil on Canvas" // could be digital, watercolor, etc.
    },
    description: {
        type: String,
        default: "No description provided."
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "review" // make sure this is written same as the one in the model creation of reivew
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User" // make sure this is written same as the one in the model creation of User
    }
});


    // Post mongoose middleware to delete all the reviews of an art automatically when the art gets deleted

artSchema.post ('findOneAndDelete', async (data) => {
    const {reviews} = data;
    
    // Method 1 to delete
    // for (order of orders) {
    //     const ord = await Order.findByIdAndDelete(order._id);
    //     console.log(ord);
    // }
    
    // Method 2
    if (reviews.length) {
        let res = await review.deleteMany({_id : {$in : reviews}}); // delete the one's in Order whose id's match with the id's of the one's in orders.
    }
});

const Art = mongoose.model("Art", artSchema);
module.exports = Art;