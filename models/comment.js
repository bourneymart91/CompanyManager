
var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

// Create schema

var commentSchema = mongoose.Schema({
    text    : String,
    author  : 
    {
        id  : 
        {
            type    : mongoose.Schema.Types.ObjectId,
            ref     : "User"
        },
        username : String
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
    
})


// 


module.exports = mongoose.model("Comment", commentSchema);