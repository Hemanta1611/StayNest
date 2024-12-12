const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const review = require("./models/review.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main(params) {
    await mongoose.connect(MONGO_URL);
};

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {throw new ExpressError(error, 400);}
    else {next();}
}
const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {throw new ExpressError(error, 400);}
    else {next();}
}

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
})

app.get("/", (req, res) =>{
    res.send("Hi, I am root");
});

/*
app.get("/testListing", async (req, res) => {
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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// index route:
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

// new & create route:
// it is above show route coz no confusion between '/id' & '/new'
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// app.post("/listings", async (req, res, next) => {
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
app.post("/listings", validateListing, wrapAsync( async (req, res, next) => {
    // if(!req.body.listing) throw new ExpressError("Invalid Data", 400);
    // let result =listingSchema.validate(req.body.listing);
    // if(result.error) throw new ExpressError(result.error.details[0].message, 400);
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

// show route:
app.get("/listings/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));


// edit route:
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

// update route:
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    if(!req.body.listing) throw new ExpressError("Invalid Data", 400);
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
    // res.redirect("/listings/${id}");
}));

// delete route:
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

// Review Route:
app.post("/listings/:id/reviews",validateReview, wrapAsync(async (req, res) => {
    let {id} = req.params;
    let newReview = new Review(req.body.review);
    let listing = await Listing.findById(id);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
}));

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
})

// Error handling middleware:
app.use((err, req, res, next) => {
    let {message, statusCode = 500} = err;
    // res.send(message).status(statusCode);
    res.render("error.ejs", {message, statusCode});
});

app.listen(8080, (req, res) =>{
    console.log("server is listening to port 8080");
});


