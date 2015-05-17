var express = require('express');
var cookies = require('cookies');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(cookies.get('token', { signed: true }) != null) { //For full explanation of signed, see https://www.npmjs.com/package/cookies
    res.render('index', { title: 'Forever', signedIn: true });
  }
  res.render('index', { title: 'Forever', signedin: false });
});

module.exports = router;
