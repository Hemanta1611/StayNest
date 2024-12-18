const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");


/*
router.get("/testListing", async (req, res) => {
    let sampleListing = new Listing({
        title: "My New Villa",
        description: "With Pool",
        price: 12000,
        location: "Bhaleswar, Nuapada",
        country: "India",
    });
    await sampleListing.save();
    console.log("sample was saved");
    res.send("successful testing");
});
*/

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {throw new ExpressError(error, 400);}
    else {next();}
}

// Index Route:
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

// New & Create Route:
// it is above show route coz no confusion between '/id' & '/new'
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// router.post("/", async (req, res, next) => {
//     // let {title, description, image, price, country, location} = req.body;
//     // let listing = req.body.listing;
//     try {
//         const newListing = new Listing(req.body.listing);
//         await newListing.save();
//         res.redirect("/listings");
//     } catch (err) {
//         next(err);
//     }
// });
router.post("/", validateListing, wrapAsync( async (req, res, next) => {
    // if(!req.body.listing) throw new ExpressError("Invalid Data", 400);
    // let result =listingSchema.validate(req.body.listing);
    // if(result.error) throw new ExpressError(result.error.details[0].message, 400);
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("successMsg", "Successfully made a new listing!");
    // req.flash("error", "Error in creating a new listing!");
    res.redirect("/listings");
}));

// Show Route:
router.get("/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}));


// Edit Route:
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}));

// Update Route:
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    if(!req.body.listing) throw new ExpressError("Invalid Data", 400);
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("successMsg", "Successfully updated a listing!");
    res.redirect("/listings");
    // res.redirect("/listings/${id}");
}));

// Delete Route:
router.delete("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("successMsg", "Successfully deleted a listing!");
    res.redirect("/listings");
}));


module.exports = router;