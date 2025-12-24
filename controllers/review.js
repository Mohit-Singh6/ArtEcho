const review = require("../models/review.js");
const listing = require("../models/listing.js");

module.exports.postReview = async (req, res, next) => {
    const artId = req.params.id;
    const data = new review(req.body.review);

    console.log("REVIEW: ", req.body.review);

    const art = await listing.findById(artId);

    art.reviews.push(data._id);
    data.owner = res.locals.currUser._id;

    await data.save();
    await art.save();

    // flash message
    req.flash('success',"Review posted successfully!");

    res.redirect('/arts/' + artId);
};


module.exports.deleteReview = async (req, res) => {
    const id = req.params.id;
    const {reviewId} = req.params;

    
    await review.findByIdAndDelete(reviewId);
    
    // Method 1 to delete from art
    await listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    
    
    // Method 2:

    // const data = await listing.findById(id);
    // let idx = data.reviews.indexOf(reviewId);
    // if (idx != -1) {
    //     data.reviews.splice(idx, 1);
    // }
    // data.save();

    
    // flash message
    req.flash('success',"Review deleted successfully!");

    res.redirect(`/arts/${id}`);
};

