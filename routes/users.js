
var express = require('express')
, router = express.Router()

var Users = require('../models/user')




router.get('/all', function(req, res) 
{
    Users.all(function(err, docs) {
    res.render('users', {users: docs})
    })
})


module.exports = router