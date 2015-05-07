var express = require('express');
var mongoose = require('mongoose');
var gridFS = require('gridfs-stream');
var conf = require('../conf');
var router = express.Router();

var connection = mongoose.connect('db-conn');
var gridConn;
connection.once('open', function() {
  gridConn = Grid(connection.db, mongoose.mongo)
});

/* GET records listing. */
router.get('/:id', function(req, res, next) {
  if(req.params.id !== null) {
    var fileExists = false;
    gridConn.exist({_id: req.params.id }, function(err, success) {
      fileExists = success;
    });
    if(success) {
      var stream = gridConn.createReadStream({
        _id: req.params.id
      });
      stream.pipe(res);  // Return file
    }
    else {
      res.send(500);
    }
  }
});

/* Upload... or something */
router.post('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
