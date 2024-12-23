// Import necessary modules
const mongoose = require("mongoose");
const initData = require("./data.js"); // Import the initial data to be inserted
const Listing = require("../models/listing.js"); // Import the Listing model

// MongoDB connection URL
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Connect to the MongoDB database
main()
  .then(() => {
    console.log("connected to DB"); // Log message on successful connection
  })
  .catch((err) => {
    console.log(err); // Log any errors during connection
  });

// Function to connect to MongoDB using Mongoose
async function main() {
  await mongoose.connect(MONGO_URL); // Connect to the MongoDB server using the provided URL
}

// Function to initialize the database with initial data
const initDB = async () => {
  await Listing.deleteMany({}); // Clear the Listing collection by deleting all existing documents
  initData.data = initData.data.map((obj) => ({...obj, owner: "676903a8d214d65248931f65"})); // Add the owner ID to each listing
  await Listing.insertMany(initData.data); // Insert the initial data into the Listing collection
  console.log("data was initialized"); // Log message after data initialization
};

// Call the initDB function to initialize the database
initDB();
