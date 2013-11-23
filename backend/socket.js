exports.setupSocket = function(server) {

  var io = require('socket.io').listen(server);
  //set log level to warn
  io.set('log level', 1);

  io.sockets.on('connection', function (socket){

    socket.on('bloop', function(message) {
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
      socket.emit('bloop', mockData);

    });
  });
}
