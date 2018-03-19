var mongoose = require("mongoose"), 
Schema = mongoose.Schema;




// Schema Setup
var supplierSchema = new mongoose.Schema(
    {
        name        : String,
        contact     : String,
        address     : String,
        telephone   : String,
        email       : String       
    });


// model setup 
module.exports = mongoose.model("Supplier", supplierSchema);