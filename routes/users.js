const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const router = express.Router();
const User = require('../models/user.js');
const passport = require('passport');
const {saveRedirectUrl} = require('../middleware.js');

router.get("/signup", (req, res) => {
    // res.send("form for signing up");
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if(err) {return next(err);}
            req.flash("successMsg", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login",saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}),async (req, res) => {
    req.flash("successMsg", "Welcome back!");
    res.redirect(res.locals.redirectUrl || "/listings");
});

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if(err) {
            // req.flash("error", "Something went wrong!");
            // return res.redirect("/listings");
            return next(err);
        }
    });
    req.flash("successMsg", "Goodbye!");
    res.redirect("/listings");
});

module.exports = router;