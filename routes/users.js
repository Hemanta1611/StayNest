const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const router = express.Router();
const User = require('../models/user.js');
const passport = require('passport');

router.get("/signup", (req, res) => {
    // res.send("form for signing up");
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        req.flash("successMsg", "Welcome to Wanderlust!");
        res.redirect("/listings");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}),async (req, res) => {
    req.flash("successMsg", "Welcome back!");
    res.redirect("/listings");
});

module.exports = router;