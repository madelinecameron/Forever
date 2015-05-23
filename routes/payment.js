var express = require('express');
var router = express.Router();

router.post('/charge', function(req, res, next) {
    console.log("Test!");
});

module.exports = router;
