
var express = require('express')
, router = express.Router()

var PurchaseOrder = require('../models/purchaseOrder')
var Supplier = require("../models/supplier");
var Job = require("../models/job");
var middleware = require("../middleware/index")



var ObjectID = require('mongodb').ObjectID;

router.get('/', middleware.isLoggedIn, function(req, res) 
{
    PurchaseOrder.find(function(err, searchedPurchaseOrders) 
    {
        res.render('purchaseOrders/index', {purchaseOrders : searchedPurchaseOrders})
    })
})




// Get
router.get("/myOrders", middleware.isLoggedIn, function(req, res)
{

    //res.send("MY ORDERS");

    PurchaseOrder.find(
        {
            "author.id"  : req.user.id
        })
    .populate('orderSupplier')
    .populate('comments')
    .populate('orderJob')
    .exec(function(err, searchedPurchaseOrders)
    {
        if (err)
        {
            console.log(err)
        }
        else
        {
            console.log("========================================")
            console.log(searchedPurchaseOrders);
            console.log("========================================")
            req.flash("error", "");
            req.flash("success","")
            res.render('purchaseOrders/index', {purchaseOrders : searchedPurchaseOrders})

        }

    })



})




// ADD
router.get('/new', middleware.isLoggedIn , function(req, res)
{

    var async = require("async");

    var Suppliers   = Supplier.find({});
    var Jobs        = Job.find({});

    var resources = {
        suppliers   : Suppliers.exec.bind(Suppliers),
        jobs     : Jobs.exec.bind(Jobs)
    };

    async.parallel(resources, function(error, results)
    {

        if(error)
        {
            res.status(500).send(error);
            return;
        }
        res.render("purchaseOrders/new", results)

    })

        
})





// ADD
router.post('/', function(req, res)
{

    // Create a new ObjectID for Supplier ID
    var objectId = new ObjectID(req.body.purchaseOrderSupplier);

    var jobId = new ObjectID(req.body.purchaseOrderJob)

    req.body.purchaseOrder.author = 
    {
        id          : req.user._id,
        username    : req.user.username 
    }

    req.body.purchaseOrder.orderSupplier = objectId;
    req.body.purchaseOrder.orderJob = jobId;
    

    PurchaseOrder.create(req.body.purchaseOrder,  function(err, purchaseOrder)
    {
        if (err)
        {
            console.log("Error : " + err)
            req.flash("error",err.message);
            return res.redirect('back');
        }
        else
        {
            console.log(purchaseOrder)
            res.redirect("/purchaseOrders/" + purchaseOrder.id);
        }

    })

    


})





// Get
router.get("/:id", function(req, res)
{


    PurchaseOrder.findById(req.params.id)
    .populate('orderSupplier')
    .populate('comments')
    .populate('orderJob')
    .exec(function(err, purchaseOrder)
    {
        if (err)
        {
            console.log(err)
        }
        else
        {
            console.log("========================================")
            console.log(purchaseOrder);
            console.log("========================================")
            req.flash("error", "");
            req.flash("success","")
            res.render("purchaseOrders/show", {purchaseOrder : purchaseOrder});

        }

    })



})




// EDIT
router.get("/:id/edit", function(req, res)
{



    PurchaseOrder.findById(req.params.id, function(err, found_purchaseOrder)
    {
        

        if (err)
        {
            console.log(err)
        }
        else if (!found_purchaseOrder)
        {
            req.flash("error","Purchase order not found")
            res.redirect("back");
        }
        else
        {
            req.flash("error", "");
            req.flash("success","")
            res.render("purchaseOrders/edit", {purchaseOrder : found_purchaseOrder});
        }


    })

})




// Update 
router.put("/:id", middleware.checkPurchaseOrderOwnership, function(req, res){
   
    // find and update the correct purchase order
    
    console.log(req.body.purchaseOrder);
    
    
    PurchaseOrder.findByIdAndUpdate(req.params.id, req.body.purchaseOrder, function(err, updatedPurchaseOrder){
        
        if(err)
        {
         res.redirect("/purchaseOrders");    
        }
        else
        {
            req.flash("success", "The purchase order has been updated");
            res.redirect("/purchaseOrders/" + req.params.id)
        }
        
    })
    
 });


 // Delete route
 router.delete("/:id", middleware.checkPurchaseOrderOwnership, function(req,res){

    PurchaseOrder.findByIdAndRemove(req.params.id, function(err){

        if(err)
        {
            res.redirect("/purchaseOrders");
        }
        else{
            console.log("Order Deleted")
            res.redirect("/purchaseOrders")
        }
    })

 })

module.exports = router