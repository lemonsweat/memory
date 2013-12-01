var logic = require('./logic.js');

exports.setupSocket = function(server) {

  var io = require('socket.io').listen(server);
  //set log level to warn
  io.set('log level', 1);

  io.sockets.on('connection', function (socket){

    socket.on('generate:grid', function(data) {

        // TODO: replace "hello" and "thar" with player names so
        // we can get a better randomized hash
        data.hashKey = logic.newGame(data.gridSize, "hello", "thar");

        // logic.prettyPrintGrid(hashKey, function(grid) {
        //     res.send(grid);
        // });


        socket.emit('generate:grid', data);
    });

    socket.on('reveal:coordinates', function(data) {
        logic.getIconAtPosition(data.hashKey, data.row, data.col, function(iconId) {
            if (iconId) {
                data.iconId = iconId;
                socket.emit('reveal:coordinates', data);
            } else {
                var error = {
                    'event': 'reveal:coordinates',
                    'message': 'Unable to get iconId'
                }
                socket.emit('error', error);
            }

        });
    });

  });
}
