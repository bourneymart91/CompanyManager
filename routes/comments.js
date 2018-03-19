var express = require('express')
  , router = express.Router({mergeParams:true});



var Comment = require('../models/comment')
var PurchaseOrder = require('../models/purchaseOrder')
var middleware = require("../middleware/index")





// Edit Comment
router.get('/:cid/edit', middleware.isLoggedIn, function(req, res )
{
  Comment.findById(req.params.cid, function(err,foundComment){

    if(err)
    {

    }
    else
    {
        res.render("comments/edit", 
        {
            purchaseOrder_id : req.params.id,
            comment         : foundComment 
        })
    }

  })
})

// Edit Comment
router.put('/:cid', middleware.isLoggedIn, function(req, res )
{
  Comment.findByIdAndUpdate(req.params.cid, req.body.comment, function(err,foundComment){

    if(err)
    {

    }
    else
    {
        res.redirect("/purchaseOrders/"+ req.params.id);
    }

  })
})

// New Comment
router.get("/new", middleware.isLoggedIn, function(req, res)
{
  
  console.log(req.url);

  console.log("All params : " + req.params)
  console.log("Look up ID : " + req.params.id)

  PurchaseOrder.findById(req.params.id, function(err, foundPurchaseOrder)
  {
      if(err)
      {
          console.log(err)
      }
      else
      {
          console.log(foundPurchaseOrder)
          res.render("comments/new", {purchaseOrder : foundPurchaseOrder})        
      }
      
  });
 
  
  
});


// Create new comment
router.post("/", middleware.isLoggedIn, function(req, res) {
    
  // lookup purchase order on id
  PurchaseOrder.findById(req.params.id, function(err, purchaseOrder)
  {
     
      if(err)
      { 
          console.log("Error : "  + err);
          req.flash("error","there was an error");
          res.redirect("/purchaseOrder/");
      }
      else
      {
      
          var newComment = new Comment(
              {
                  author : req.body.comment.author,
                  text : req.body.comment.text
              }
              );
          
          newComment.author.id = req.user._id;
          newComment.author.username = req.user.username;
          
          Comment.create(newComment, function(err, comment)
          {
           
              if (err)
              {
                  console.log("ERROR" + err);    
                  req.flash("error", "There was an error");
                  res.redirect("purchaseOrders/");
              }  
              else
              {

                  purchaseOrder.comments.push(comment._id);
                  purchaseOrder.save();
                  
                  console.log("Your Comment has been saved")

                  req.flash("success", "Your comment has been added");
                  res.redirect("/purchaseOrders/" + purchaseOrder._id);
              }
          });
         
         
      }
  });
  
});



module.exports = router