const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main(params) {
    await mongoose.connect(MONGO_URL);
};

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

// index route:
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

// show route:
app.use(express.urlencoded({extended: true}));
app.get("/listings/:id", async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

app.listen(8080, (req, res) =>{
    console.log("server is listening to port 8080");
});


