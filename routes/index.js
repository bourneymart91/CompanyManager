var express = require('express');
var router = express.Router();

// vars relating to users and authentication
var passport = require("passport");
var User = require("../models/user.js");




router.get('/', function(req, res) 
{    
    res.render("landing")

})



// =====================================
// AUTHENTICATION ROUTES
// =====================================



// Show the register form
router.get("/register", function(req, res) {
   
    res.render("register")
     
 });
 
 
 
 
 
 
 router.post("/register", function(req, res) {
     
     
     console.log(req.body.username);
     console.log(req.body.password);
     
     
     
     // Initialise a new user object
     var newUser = new User(
         {
         username : req.body.username
     
        }
    );
     
     
     if (req.body.adminCode === process.env.ADMINCODE)
     {
         newUser.isAdmin = true;    
     }
     
     //eval(require("locus"))
     
     User.register(newUser, req.body.password, function(err, user)
     {
         if(err)
         {
             console.log("Error : " + err);
             req.flash("error", "Could not register : " + err);
             return res.render("register");
         }
         
         passport.authenticate("local")(req, res, function()
         {
             req.flash("success", "You have successfully registered. Welcome " + user.username);
             res.redirect("/purchaseOrders");
         });
     }); 
 });
     
 
 
 
 
 // Login Routes -----------------------------
 
 // Show login form
 router.get("/login", function(req, res) {
     
     res.render("login",{});
     
 });
 
 
 
 // Handle login logic - Uses middleware
 router.post("/login", passport.authenticate("local", 
     {
         successRedirect : "/purchaseOrders",
         failureRedirect : "/login"
     }
    ), function(req, res) 
     {
         
     });
 
 
 // Logout Routes -------------------------
 
 
 router.get("/logout", function(req, res) {
     
     // 
     req.logout();
     req.flash("success", "Logged you out!");
     res.redirect("/");
     
 });
 
 


module.exports = router;
