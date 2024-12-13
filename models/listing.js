const { required } = require("joi");
const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  filename: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: imageSchema,
    required: true,
    default: {
      filename: "defaultimage",
      url: "https://unsplash.com/photos/a-swimming-pool-with-lounge-chairs-and-an-umbrella-a86IntDZ9Oc",
    },
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
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ],
});

listingSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
