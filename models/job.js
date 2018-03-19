var mongoose = require("mongoose"),
    Schema = mongoose.Schema;


// Create schema

var jobSchema = mongoose.Schema({
    name    : String,
    location : String,
    createdAt : {
        type : Date,
        default : Date.now
    }
    
})


// 


module.exports = mongoose.model("Job", jobSchema);