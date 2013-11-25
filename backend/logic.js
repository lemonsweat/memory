var redis_host      = "pub-redis-18517.us-east-1-2.1.ec2.garantiadata.com",
    redis_port      = "18517",
    redis_passwd    = "sjpdBK1KsFgsMYMP",
    redis_db        = "redis-app19718755";

var _               = require('underscore'),
    _redis_server   = require('redis'),
    _SEED           = 65456181651689,
    redis           = _redis_server.createClient(redis_port, redis_host);

redis.auth(redis_passwd);

redis.on('ready', function(val) {
    console.log("ready!");
});

var redisUtil = {
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

  generateHashKey: function(player1, player2) {
    var playerHash = 0;
    playerHash += redisUtil.getPlayerHash(player1);
    playerHash += redisUtil.getPlayerHash(player2);
    playerHash *= Math.random() 
    playerHash = Math.round(playerHash * _SEED);

    return playerHash.toString(36);
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

  getIconAtPosition: function(hashKey, row, col, callback) {
    redisUtil.getGrid(hashKey, function(callback) {

    });
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
