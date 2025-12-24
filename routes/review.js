const express = require('express');
const wrapAsync = require('../utilities/wrapAsync.js');
const reviewController = require('../controllers/review.js');

const { validateReview, isLoggedIn, isRevOwner } = require('../middleware.js');

const router = express.Router({ mergeParams: true }); // so that the :id like things come from app.js to directly here in review.js and you won't have to write the whole route again.
// If you don't write this mergeParams: true then the parameters will stay in app.js only and they wouldn't be able to come here in review.js


    // posting reviews

router.post("/", isLoggedIn, validateReview, wrapAsync (reviewController.postReview));


// delete reviews

router.delete("/:reviewId", isLoggedIn, isRevOwner, wrapAsync (reviewController.deleteReview));

module.exports = router;