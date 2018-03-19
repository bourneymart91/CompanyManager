
var express = require('express')
, router = express.Router()

var PurchaseOrder = require('../models/purchaseOrder')
var Supplier = require("../models/supplier");
var middleware = require("../middleware/index")



// Get all suppliers
router.get('/', middleware.isLoggedIn, function(req, res) 
{
    Supplier.find(function(err, suppliers) 
    {
        if (err)
        {
            console.log("ERROR")
        }
        else
        {
            console.log("Found Suppliers")
            console.log(suppliers)
            res.render('suppliers/index', {suppliers : suppliers})
        }
        
    })
})




// ADD a supplier
router.get('/new',  middleware.isLoggedIn , function(req, res)
{

    res.render('suppliers/new');
    


})


// Find Supplier by ID
router.get('/:id', middleware.isLoggedIn, function(req, res) 
{
    Supplier.findById( req.params.id, function(err, searchedSupplier) 
    {
        if (err)
        {
            console.log("ERROR")
        }
        else
        {
            res.render('suppliers/show', {supplier : searchedSupplier})
        }
        
    })
})










// ADD
router.post('/', middleware.isLoggedIn, function(req, res)
{



    Supplier.create(req.body.supplier,  function(err, newSupplier)
    {
        if (err)
        {
            console.log("Error : " + err);
            req.flash("error",err.message);
            return res.redirect('back');
        }

        else
        {
            console.log("Added Supplier")
            res.redirect("/suppliers/" + newSupplier._id);
        }

    })

    


})




// EDIT
router.get("/:id/edit", middleware.isLoggedIn, function(req, res)
{



    Supplier.findById(req.params.id, function(err, foundSupplier)
    {
        

        if (err)
        {
            console.log(err)
        }
        else if (!foundSupplier)
        {
            req.flash("error","Supplier not found")
            res.redirect("back");
        }
        else
        {
            req.flash("error", "");
            req.flash("success","")
            res.render("suppliers/edit", {supplier : foundSupplier});
        }


    })

})




// Update Supplier
router.put("/:id", middleware.isLoggedIn, function(req, res){
   
    // find and update the correct camp ground
    
    console.log(req.body.supplier);
    
    
    Supplier.findByIdAndUpdate(req.params.id, req.body.supplier, function(err, updatedSupplier){
        
        if(err)
        {
         res.redirect("/suppliers");    
        }
        else
        {
            req.flash("success", "The supplier has been updated");
            res.redirect("/suppliers/" + req.params.id)
        }
        
    })
    
 });


module.exports = router