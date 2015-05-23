var express = require('express');
var mongoose = require('mongoose');
var gridFS = require('gridfs-stream');
var stripe = require('stripe')(process.env.STRIPE_TEST);
var User = require('../models/User');
var fs = require('fs');

var router = express.Router();

//The reasoning behind two connections to database is due to the difference between createConnection and connect. We can't use and pass the connect object before schemas are created, etc.
//This may be something to consider later on.
var connection = mongoose.createConnection('mongodb://%USER%:%PASS%@ds037087.mongolab.com:37087/forever'.replace('%USER%', process.env.DB_USER).replace('%PASS%', process.env.DB_PASS));
console.log("Database connected successfully (2)!");
var gridConn;

connection.once('open', function() {
  gridConn = gridFS(connection.db, mongoose.mongo)
});

router.get('/newRecord', function(req, res, next) {
  console.log("Posting new record");
  console.log(req.query);
  var size;
  gridConn.findOne({ _id: req.query.id }, function(err, file) {
    size = file.length;
  });
  res.render('newRecord', { id: req.query.id, size: size, price: (size * process.env.GIG_PRICE) }); //Don't pass size, change this to retrieve from DB.
});

router.post('/newRecord', function(req, res, next) {
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
  res.render('records', { price: process.env.GIG_PRICE, stripe_pk: process.env.STRIPE_PK });
});


/* Upload... or something */
router.post('/', function(req, res, next) {
  var writeStream = gridConn.createWriteStream({ content_type: req.files.upload.mimetype });
  fs.createReadStream(req.files.upload.path).pipe(writeStream);
  writeStream.on('close', function(file) {
    if(req.user) {  //If user is logged in
      User.findOneAndUpdate({ _id: req.user._id }, { $push: { files: { record_id: file._id.toString() } } }, { upsert: true, safe: true }, function(err, user) {
        console.log(err);
      });
    }
    else {
      //Ask for email?
      console.log("no user logged in! :o")
    }
    console.log("File successfully uploaded!");
    res.send(file._id);
  });
});

module.exports = router;
