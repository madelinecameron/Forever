var restify = require('restify');
var mongoose = require('mongoose');
var session = require('restify-session')({
        debug: true,
        persist: true
    });
var db_creds = require('./conf/db_conf.json');
var gridFS = require('gridfs-stream');

var dbConnect = mongoose.connect(("mongodb://%username%:%password%@ds053300.mongolab.com:53300/solobuy".replace("%username%",
    db_creds.db.username).replace("%password%", db_creds.db.password)));  // Pulls username and password from conf file
console.log("Database connection initiated successfully!");

dbConnect.once('open', function () {
    var gfs = gridFS(dbConnect.db);

    // all set!
});

var server = restify.createServer({name: 'Forever_HTTP_Server' });
server.pre(restify.pre.sanitizePath());

//var port = process.argv[2] != null ? process.argv[2] : 3000; //If parameter exists, use as port, if not port 300
server.listen(3000, function() {
    console.log("HTTP Server listening on port %d", 3000);
});

server.use(restify.fullResponse());
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(session.sessionManager);

require('./api/records/index')(server);