var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

//OTHER ROUTES
router.get("/", (req, res)=>{
    res.render("landing.ejs");
});


//==================================
//AUTHENTICATION ROUTES
//===================================

router.get("/register",(req,res)=>{
    res.render("register.ejs");
});

router.post("/register", (req,res)=>{
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register.ejs");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//SHOW LOGIN FORM
router.get("/login",(req,res)=>{
    res.render("login.ejs");
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req,res)=>{    //Really no need of callback function here so leave it
});

//  LOGOUT ROUTE
router.get("/logout", (req,res)=>{
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/campgrounds");
});


module.exports = router;