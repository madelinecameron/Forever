var express = require('express');
var mongoose = require('mongoose');
var gridFS = require('gridfs-stream');
var stripe = require('stripe')(process.env.STRIPE_KEY);

var router = express.Router();

//The reasoning behind two connections to database is due to the difference between createConnection and connect. We can't use and pass the connect object before schemas are created, etc.
//This may be something to consider later on.
var connection = mongoose.createConnection('mongodb://%USER%:%PASS%@ds037087.mongolab.com:37087/forever'.replace('%USER%', process.env.DB_USER).replace('%PASS%', process.env.DB_PASS));
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
  console.log(req.files.file);
  var writeStream = gridConn.createWriteStream({ content_type: req.files.file.mimetype });
  fs.createReadStream(req.files.file.path).pipe(writeStream);
  writeStream.on('close', function(file) {
    res.redirect('newRecord?id=' + file._id + '&size=' + req.files.file.size); //Don't pass size, change this to retrieve from DB.
  });
});

router.get('/newRecord', function(req, res, next) {
  res.render('newRecord', {id: req.query.id, size: req.query.size }); //Don't pass size, change this to retrieve from DB.
});

router.post('/newRecord', function(req, res, next) {

});

module.exports = router;
