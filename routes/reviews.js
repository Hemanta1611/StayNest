const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview} = require("../middleware.js");

// Post Review Route:
router.post("/",validateReview, wrapAsync(async (req, res) => {
    let {id} = req.params;
    let newReview = new Review(req.body.review);
    let listing = await Listing.findById(id);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("successMsg", "Successfully added a review!");
    res.redirect(`/listings/${id}`);
}));

// Review Delete Route:
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let {id, reviewId} = req.params;
    let deletedReview = await Review.findByIdAndDelete(reviewId);
    let listing = await Listing.findById(id);
    listing.reviews.pull(deletedReview);
    await listing.save();
    req.flash("successMsg", "Successfully deleted a review!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;