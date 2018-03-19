var express = require('express')
  , router = express.Router()

var Jobs = require('../models/job')
var PurchaseOrders = require("../models/purchaseOrder")
var middleware = require("../middleware/index")




router.get('/', middleware.isLoggedIn, function(req, res) 
{
    Jobs.find(function(err, searchedJobs) 
    {
        if (err){
            console.log("Error : " + err)
        }
        else
        {
            res.render('jobs/index', {jobs : searchedJobs})
        }
    })
})


// Add a new job
router.get('/new', middleware.isLoggedIn, function(req, res){

    res.render("jobs/new")

})

// Get a job by ID
router.get("/:id", middleware.isLoggedIn, function(req,res)
{

    // Get all purchase orders associated with a job

    var FoundOrders   = PurchaseOrders.find({orderJob : req.params.id});
    var FoundJob      = Jobs.findById(req.params.id);

    var resources = {
        purchaseOrders  : FoundOrders.exec.bind(FoundOrders),
        job     : FoundJob.exec.bind(FoundJob)
    };


    var async = require('async');
    async.parallel(resources, function(error, results)
    {

        if(error)
        {
            res.status(500).send(error);
            return;
        }

        console.log(results)

        res.render("jobs/show", results)

    })

    // Jobs.findById(req.params.id, function(err, foundJob)
    // {
    //     if (err)
    //     {
    //         console.log("Error : " + err)
    //     }
    //     else
    //     {
    //         console.log(foundJob)
    //         res.render("jobs/show", {job : foundJob, orders : foundOrders});
    //     }


    // })

})



// Add new job
router.post("/", middleware.isLoggedIn, function(req,res)
{

    Jobs.create(req.body.job, function(err, newJob){

        if (err)
        {
            console.log("Error Creating new job");
        }
        else
        {
            console.log(newJob);
            res.redirect("jobs/"+ newJob._id)
            
        }

    })

})




// EDIT
router.get("/:id/edit", middleware.isLoggedIn, function(req, res)
{

    Jobs.findById(req.params.id, function(err, foundJob)
    {
        

        if (err)
        {
            console.log(err)
        }
        else if (!foundJob)
        {
            req.flash("error","Job not found")
            res.redirect("back");
        }
        else
        {
            req.flash("error", "");
            req.flash("success","")
            res.render("jobs/edit", {job : foundJob});
        }


    })

})


// Update 
router.put("/:id", middleware.isLoggedIn, function(req, res)
{
    // find and update the correct purchase order
    
    console.log(req.body.job);
    
    
    Jobs.findByIdAndUpdate(req.params.id, req.body.job, function(err, updatedJob){
        
        if(err)
        {
            res.redirect("/jobs");    
        }
        else
        {
            req.flash("success", "The purchase order has been updated");
            res.redirect("/jobs/" + req.params.id)
        }
        
    })
    
 });

module.exports = router