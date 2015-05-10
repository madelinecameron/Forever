var express = require('express');
var mongoose = require('mongoose');
var gridFS = require('gridfs-stream');
var conf = require('../conf.json');
var fs = require('fs');
var router = express.Router();

var connection = mongoose.createConnection('mongodb://%USER%:%PASS%@ds037087.mongolab.com:37087/forever'.replace('%USER%', conf.db.user).replace('%PASS%', conf.db.pass));
console.log("Database connected successfully!");
var gridConn;

connection.once('open', function() {
  gridConn = gridFS(connection.db, mongoose.mongo)
});

/* GET records listing. */
router.get('/:id', function(req, res, next) {
  if(req.params.id !== null) {
    var fileExists = false;
    gridConn.exist({ _id: req.params.id }, function(err, doesExist) {
      console.log(doesExist);
      if(doesExist) {
        var stream = gridConn.createReadStream({
          _id: req.params.id
        });
        stream.pipe(res);  // Return file
      }
      else {
        res.sendStatus(400);
      }
    });
  }
});

router.get('/', function(req, res, next) {
  res.render('records');
});


/* Upload... or something */
router.post('/', function(req, res, next) {
  var writeStream = gridConn.createWriteStream({ content_type: req.files.file.mimetype });
  fs.createReadStream(req.files.file.path).pipe(writeStream);
  writeStream.on('close', function(file) {
    res.render('newRecord', {id: file._id});
  });
});

module.exports = router;
