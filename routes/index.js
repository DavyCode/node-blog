var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var posts = db.get('posts');
  posts.find({}, {}, function(err, posts) {
    // if(err){
    //   res.send( "post not found");
    //   console.log( err.message);
    // }
    res.render('index', { "posts" : posts});
    console.log( posts.body);
    
  }); 
});

module.exports = router;
