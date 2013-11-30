var express = require('express'),
  http = require('http'),
  app = express();

app.locals.pretty = true;

// var corsMiddleware = function(req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     next();
// }

/** config */
app.configure(function() {
    app.set('port', process.argv[2] || process.env.PORT || 1337);
    // app.set('view engine', 'jade');
    app.set('views', __dirname + '../frontend');
    app.use('/public', express.static(__dirname + '/public'));
    app.use(express.bodyParser());
    // app.use(corsMiddleware);
});

var logic = require('./logic.js');
app.get('/', function(req, res) {
    // var grid = logic.generateGrid(10, 10);

    // TODO: use this hashkey for now to do some testing.
    // uncomment line below for a random hashkey for every new game.
    // var hashKey = logic.generateHashKey("hello", "thar");

    var hashKey = logic.newGame(10, "hello", "thar");

    logic.prettyPrintGrid(hashKey, function(grid) {
        res.send(grid);
    });

});

/** Start server */

var server = http.createServer(app);
var socket = require('./socket.js').setupSocket(server);

server.listen(app.get('port'), function(){
    console.log("Server started on: " + app.get('port'));
});
