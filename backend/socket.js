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

    /**
     *  Adds score to the player who discovered two of the same icons. Also does a
     *  server side check to make sure that the two indicies match
     */
    socket.on('player:addscore', function(data) {
        logic.addScore(data.hashKey, data.player, data.index1, data.index2, function(scoreData) {
            if (scoreData.error) {
                socket.emit('error', scoreData.error);
                return;
            }
            // Current player's score
            data.score = scoreData.score;
            data.scoreBoard = scoreData.updatedScores;
            // TODO: publish to room that users are subscribed to the updated scores.
            socket.emit('player:addscore', data);
        });
    });

  });
}
