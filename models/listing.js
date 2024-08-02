// listing = places (i.e. apartment, flat, house, villa, hotel)
const mongoose = require('mongoose');
const Schema = mongoose.Schema

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        default: "https://unsplash.com/photos/a-swimming-pool-with-lounge-chairs-and-an-umbrella-a86IntDZ9Oc",
        set: (v) => v === "" ? "https://unsplash.com/photos/a-swimming-pool-with-lounge-chairs-and-an-umbrella-a86IntDZ9Oc" : v,
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;