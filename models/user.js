var mongoose = require("mongoose"), 
  Schema = mongoose.Schema;

  
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema(
  {  
    username    : String,
    password    : String,
    isAdmin     : 
    {
            type    : Boolean,
            default : false
    }
})


// Add in methods to user
UserSchema.plugin(passportLocalMongoose);



module.exports = mongoose.model("User", UserSchema)