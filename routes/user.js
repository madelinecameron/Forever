var express = require('express');
var cookies = require('cookies');
var router = express.Router();

var user_management = new (require('user-management'))(
    {
        hostname: 'mongodb://%USER%:%PASS%@ds037087.mongolab.com:37087/forever'.replace('%USER%', process.env.DB_USER).replace('%PASS%', process.env.DB_PASS)
    });

router.get('/register', function(req, res, next) {
    res.render('register', { title: 'Forever - Register' });
});

router.post('/register', function(req, res, next) {
    if(!user_management.userExists(req.body.username)) {
        user_management.createUser(req.body.username, req.body.password, { email: req.body.email }, function(err) {
            if(err) {
                res.send(err, 400);
            }
            else {
                res.send(200);
            }
        });
    }
    else {
        res.send("Username already exists", 403);
    }
});

router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Forever - Login' });
});

router.post('/login', function(req, res, next) {
    user_management.authenticateUser(req.body.username, req.body.password, function(err, results) {
        if(err) {
            res.send(err, 400);
        }
        else {
            if(results.userExists && results.passwordsMatch) {
                cookies.set('token', results.token, { maxAge: 1008000, secure: true, signed: true }); //1008000 is one week in milliseconds
                res.redirect('/'); //Redirect to home
            }
        }
    })
});

module.exports = router;
