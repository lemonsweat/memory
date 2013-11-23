var port = 9998,
    io  = require('socket.io').listen(port, function() {
        console.log('socket.io started on:', port)
    });

io.set('log level', 1);

io.sockets.on('connection', function(socket) {
    console.log("New client connected!");
    socket.emit('new:data', "Hello world!");
});
