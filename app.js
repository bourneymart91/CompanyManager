var express = require('express');
var app = express();

// Initialise Databse
var mongoose    = require("mongoose");
//mongoose.connect();


// Used for envionrment variables
var dotenv = require('dotenv');
dotenv.config();

// Set up body parser
var bodyparser  = require("body-parser");
app.use(bodyparser.urlencoded({extended : true}));

// Set up moments - for parsing and validating times
app.locals.moment = require("moment");

// Require method-override - used for PUT and DELETE
var methodOverride = require("method-override");
app.use(methodOverride("_method"));


// Set View Engine
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"));


// Require models
var Comment         = require("./models/comment")
var User            = require("./models/user"); 
var PurchaseOrder   = require("./models/purchaseOrder")
var Supplier        = require("./models/supplier")
var Jobs            = require("./models/job")


// Require passport for authentication
var passport = require("passport");
var LocalStrategy = require("passport-local");





// PASSPORT CONFIGURATION
app.use(require("express-session")({
    
    secret : "elegant hill 011",
    resave : false,
    saveUninitialized : false
    
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




// Connect to Mongo on start
var url = process.env.DB_URL



var db = mongoose.connect(url, function(err) {
  if (err) 
  {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else 
  {
    app.listen(3000, function() {
      console.log('Listening on port 3000...')
    })
  }
})







// Flash requires sessions
var flash = require("connect-flash");
app.use(flash());

// Middleware which runs on all routes
app.use(function(req, res, next)
{

    res.locals.currentUser  = req.user;
    res.locals.error        = req.flash("error");
    res.locals.success      = req.flash("success");
    
    next();
    
});



// Requiring Routes =====================

// Middleware which runs on all routes
app.use(function(req, res, next)
{

    res.locals.currentUser  = req.user;
    res.locals.error        = req.flash("error");
    res.locals.success      = req.flash("success");
    
    next();
    
});



// Routing
var PurchaseOrderRoutes     = require("./routes/purchaseOrders")
var UserRoutes              = require("./routes/users")
var CommentRoutes           = require("./routes/comments")
var IndexRoutes             = require("./routes/index")
var SupplierRoutes          = require("./routes/suppliers")
var JobsRoutes              = require("./routes/jobs")

app.use(IndexRoutes)
app.use("/purchaseOrders", PurchaseOrderRoutes);
app.use("/purchaseOrders/:id/comments", CommentRoutes)
app.use("/suppliers", SupplierRoutes);
app.use("/jobs", JobsRoutes);





app.listen(process.env.PORT, process.env.IP, function()
{
   
   console.log("The PO server has started"); 
    
});