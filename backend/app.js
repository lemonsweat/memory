var express = require('express'),
    http = require('http'),
    app = express();

app.locals.pretty = true;

// var corsMiddleware = function(req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     next();
// }

/**
 * config
 *
 */
app.configure(function() {
    app.set('port', process.argv[2] || process.env.PORT || 1337);
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/views');
    app.use('/public', express.static(__dirname + '/public'));
    app.use(express.bodyParser());
    // app.use(corsMiddleware);
});

app.get('/', function(req, res) {
    // console.log("someone wants me");
    res.send("Hello world");
});

/**
 * Start server
 *
 */

var server = http.createServer(app);

/**
 * Start the socket server
 *
 */

var io = require('socket.io').listen(server);
//set log level to warn
io.set('log level', 1);

io.sockets.on('connection', function (socket){

    socket.on('channel_user:list', function(message) {
        var mockData =  [
            {
                id: 1,
                name: "bill"
            },
            {
                id: 2,
                name: "bob"
            },
            {
                id: 3,
                name: "ben"
            },
        ];
        socket.emit('channel_user:list', mockData);

    });

});

server.listen(app.get('port'), function(){
    console.log("Server started on: " + app.get('port'));
});
