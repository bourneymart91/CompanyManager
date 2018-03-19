
var PurchaseOrder   = require("../models/purchaseOrder.js");
var Comment         = require("../models/comment.js");


var middlewareObj = {};



middlewareObj.isLoggedIn = function isLoggedIn(req, res, next)
{
    if(req.isAuthenticated())
    {
        
        return next();
    }
    
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}






middlewareObj.checkPurchaseOrderOwnership = function checkPurchaseOrderOwnership(req, res, next)
{
    
    
    // Check is user logged in 0 - Redirect 1 - 
    if (req.isAuthenticated()) 
    {
        
        // Check if user owns the campground
        PurchaseOrder.findById(req.params.id, function(err, purchaseOrder)
        {

            if(err)
            {
                console.log(err);
                req.flash("error", "Purchase order not found!");
                res.redirect("back")
            }
            else
            {
                
                
                if(!purchaseOrder)
                {
                    req.flash("error", "Purchase Order not found!");
                    res.redirect("back");
                }
                
                
                
                // compare ID 
                if (purchaseOrder.author.id.equals(req.user._id))
                {
                    
                    next();
                } 
                else
                {
                    req.flash("error", "You dont have permission to do this!");
                    res.redirect("back");
                }
                
            }
            
        });
    }
    else
    {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }

    
}


middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next)
{
    
    
    // Check is user logged in 0 - Redirect 1 - 
    if (req.isAuthenticated()) 
    {
        
        // Check if user owns the comment
        Comment.findById(req.params.comment_id, function(err, comment)
        {

            if(err)
            {
                req.flash("error", "The comment you are trying to edit does not exist");
                res.redirect("back")
            }
            else
            {
                // compare ID 
                if (comment.author.id.equals(req.user._id))
                {
                    next();
                    
                } 
                else
                {
                    res.redirect("back");
                }
                
            }
            
        });
    }
    else{
        res.redirect("/login");
    }

    
}




module.exports = middlewareObj