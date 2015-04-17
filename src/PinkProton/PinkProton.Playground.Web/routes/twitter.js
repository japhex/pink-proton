var express = require('express');
var Twitter = require('twitter');
var router = express.Router();

router.get('/', function (req, res) {
    // see: https://dev.twitter.com/oauth/tools/signature-generator/8184117?nid=812
    res.send('see "app.js" for more details');
});

module.exports = router;