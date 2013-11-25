var redis_host      = "pub-redis-18517.us-east-1-2.1.ec2.garantiadata.com",
    redis_port      = "18517",
    redis_passwd    = "sjpdBK1KsFgsMYMP",
    redis_db        = "redis-app19718755";

var _               = require('underscore'),
    _redis_server   = require('redis'),
    redis           = _redis_server.createClient(redis_port, redis_host);

redis.auth(redis_passwd);

redis.on('ready', function(val) {
    console.log("ready!");
});

var redis_util = {
    getPlayerHash: function(player) {
        var playerHash = 0;
        _.each(player, function(c) {
            playerHash += c.charCodeAt(0);
        });
        return playerHash;
    },

    saveGrid: function(key, grid, callback) {
        redis.hset(key, grid, callback);
    },

    getGrid: function(key, callback) {
        redis.hget(key, calback);
    }
}

var exports = {
  _SEED: 123123137,

  generateHashKey: function(player1, player2) {
    var playerHash = 0;
    playerHash += redis_util.getPlayerHash(player1);
    playerHash += redis_util.getPlayerHash(player2);

  },

  generateGrid: function(gridLength, gridWidth) {
    if (!gridWidth) {
        gridWidth = gridLength;
    }
    var totalCards = gridLength * gridWidth;

    if ((totalCards % 2) || (gridLength < 1) || (gridWidth < 1)) {
        return false;
    }

    var uniqueCards = totalCards / 2;
    var shuffledCards = _.shuffle(_.range(uniqueCards).concat(_.range(uniqueCards)));

    var grid = [];
    for (var i = 0; i < gridLength; i++) {
        var row = [];
        for (var j = 0; j < gridWidth; j++) {
            row.push(shuffledCards.pop());
        }
        grid.push(row);
    }
    return grid;
  },

  prettyPrintGrid: function(grid) {
    var retval = "";
    _.each(grid, function(row) {
        _.each(row, function(elem) {
            retval += elem + "   ";
        });
        retval += "<br/>";
    });
    return retval;
  }
};


module.exports = exports;
