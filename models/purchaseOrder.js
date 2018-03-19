var mongoose = require("mongoose"), 
Schema = mongoose.Schema;




// Schema Setup
var purchaseOrderSchema = new mongoose.Schema(
    {
        name        : String,
        description : String,
        price       : String,
        createdAt   : 
        {
                type    : Date,
                default : Date.now 
        }, 
        comments    : 
        [
            {
                type    : mongoose.Schema.Types.ObjectId,
                ref     : "Comment" 
            }
        ],
        orderSupplier : 
        {
                type    : mongoose.Schema.Types.ObjectId,
                ref     : "Supplier"
        },
        orderJob : 
        {
                type    : mongoose.Schema.Types.ObjectId,
                ref     : "Job"
        },
        author : 
        {
            id : 
            {
                type    : mongoose.Schema.Types.ObjectId,
                ref     : "User" 
            },
            username : String
        }
        // orderLines    : 
        // [
        //     {
        //         type    : mongoose.Schema.Types.ObjectId,
        //         ref     : "OrderLine" 
        //     }
        // ]         
    });


// model setup 
module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);