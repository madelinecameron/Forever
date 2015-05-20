var express = require('express');
var cookies = require('cookies');
var passport = require('passport');
var User = require('../models/User');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.cookies.get('token', { signed: true }) != null) { //For full explanation of signed, see https://www.npmjs.com/package/cookies
    res.render('index', { title: 'Forever', signedIn: true });
  }
  else {
    res.render('index', { title: 'Forever', signedIn: false });
  }
});

var user_management = new (require('user-management'))(
    {
      hostname: 'mongodb://%USER%:%PASS%@ds037087.mongolab.com:37087/forever'.replace('%USER%', process.env.DB_USER).replace('%PASS%', process.env.DB_PASS)
    });


router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Forever - Register' });
});

router.post('/register', function(req, res, next) {
  User.register(new User({ username: req.body.username }), req.body.password, function(err) {
    if(err) {
      res.send(400);
    }
    res.redirect('/');
  })
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Forever - Login' });
});

router.post('/login', passport.authenticate('local'), function(req, res, next) {
  res.redirect('/');
});

module.exports = router;
