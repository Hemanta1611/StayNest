const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const usersRouter = require("./routes/users.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main(params) {
    await mongoose.connect(MONGO_URL);
};

const sessionConfig = {
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize()); // a middleware that initializes passport
app.use(passport.session()); // a middleware that allows persistent login sessions
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
})

app.get("/", (req, res) =>{
    res.send("Hi, I am root");
});


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("successMsg");
    res.locals.error = req.flash("error");
    next();
});

// demo user:
// app.get("/fakeUser", async (req, res) => {
//     const user = new User({email: "4BZ9T@example.com", username: "test"});
//     const newUser = await User.register(user, "pass123");
//     res.send(newUser);
// });

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);

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


