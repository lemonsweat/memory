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
  var hash = logic.generateGameHash("hello", "thar");
  console.log("hash", hash);
  // res.send("hash: " + hash + "<br/>number: " + logic.convertHashToNumber(hash));
  res.send(logic.makeSolutionGrid("1d35a9c4", 10));
});

/** Start server */

var server = http.createServer(app);
var socket = require('./socket.js').setupSocket(server);

server.listen(app.get('port'), function(){
  console.log("Server started on: " + app.get('port'));
});
