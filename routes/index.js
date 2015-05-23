var express = require('express');
var passport = require('passport');
var User = require('../models/User');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user) {
    res.render('index', { title: 'Forever', signedIn: true });
  }
  else {
    res.render('index', { title: 'Forever', signedIn: false });
  }
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

router.get('/profile', function(req, res, next) {
  if(req.user) {
    User.findOne({ _id: req.user._id }, { files: 1 }, function(err, user) {
      if(err) console.log(err);
      else {
        res.render('profile', {title: 'Forever - Login', records: user.files });
      }
    });
  }
  else {
    res.redirect('/');
  }
});
module.exports = router;
