var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");

//CAMPGROUND ROUTES

router.get("/campgrounds", (req,res)=>{
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index.ejs",{campgrounds: allCampgrounds, currentUser:req.user});
        }
    })
    //res.render("campgrounds.ejs",{campgrounds: campgrounds});
});

//Create - add new campground to db
router.post("/campgrounds",middleware.isLoggedIn, (req, res)=>{
    var name = req.body.name;
    var price= req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author ={
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name ,price: price ,image: image, description: description, author: author}
    Campground.create(newCampground, function(err, newlycreated){
        if(err){
            console.log("error");
        }else{
            console.log(newlycreated);
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campgriund
router.get("/campgrounds/new",middleware.isLoggedIn, (req,res)=>{
    res.render("campgrounds/new.ejs");
});

//SHOW - INFO ABOUT EACH CAMPGROUND

router.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec( function(err, foundcampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show.ejs", {campground: foundcampground});
        }
    });
});


//EDIT CAMPGROUND ROUTE --itcontains a middleware
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership, (req,res)=>{
        Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit.ejs", {campground: foundCampground});
        });
});

//UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req,res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedcampground){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
