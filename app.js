var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    seedDB        = require("./seeds"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    methodOverride= require("method-override"),
    flash         = require("connect-flash")

var commentRoutes   = require("./routes/comments"),
    campgroundRoutes= require("./routes/campgrounds"),
    indexRoutes= require("./routes/index")


mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser: true, useUnifiedTopology:true});
mongoose.connection
    .once('open',() => console.log('database connected'))
    .on('error',(error) =>{
        console.log("YOUR ERROR",error);
    });

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static(__dirname+"/public"));

app.use(methodOverride("_method"));

app.use(flash());

//seedDB(); //IN SEEDS FILE

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Something random statement",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){ //This is used to pass any values mentioned to header file in every route
    res.locals.currentUser= req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();  //This line is important to execute remaining route code
});

/// USE ALL THE ROUTES WE DEFINED IN FIFFERENT FILES
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);


app.listen(3000,()=>{
    console.log("server started");
});