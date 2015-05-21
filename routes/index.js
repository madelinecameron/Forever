var express = require('express');
var passport = require('passport');
var User = require('../models/User');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Forever', signedIn: false });
  console.log(req);
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Forever - Register' });
});

router.post('/register', function(req, res, next) {
  console.log(req.body);
  User.register(new User({ username: req.body.username }), req.body.password, function(err, account) {
    if(err) {
      console.log(account);
      res.send(err);
    }
    console.log(account);
    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  })
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Forever - Login' });
});

router.post('/login', passport.authenticate('local'), function(req, res, next) {
  res.redirect('/');
});

module.exports = router;
