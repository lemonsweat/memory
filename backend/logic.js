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
    _BOARD_WIDTH_KEY: "bWidth",
    _BOARD_HEIGHT_KEY: "bHeight",
    _META_KEY: ":meta",
    _EXPIRE_TIME: 3600, // Expire time in seconds

    getGridElemAtIndex: function(hashKey, index, callback) {
        redis.lindex(hashKey, index, callback);
        this.resetExpireOnKey(hashKey);
    },

    /**
     * Returns callback(width, height)
     */
    getGridSize: function(hashKey, callback) {
        redis.hmget(hashKey + this._META_KEY, this._BOARD_HEIGHT_KEY, this._BOARD_WIDTH_KEY, function(err, boardSize) {
            callback(boardSize[0], boardSize[1]);
        });

        this.resetExpireOnKey(hashKey);
    },

    getGrid: function(hashKey, callback) {
        redis.lrange(hashKey, 0, -1, function(err, grid) {
            callback(grid);
        });

        this.resetExpireOnKey(hashKey);
    },

    saveGrid: function(hashKey, grid, width, height) {
        this._setGrid(hashKey, grid);
        this._setGridSize(hashKey, width, height);
        this.resetExpireOnKey(hashKey);
    },

    _setGrid: function(hashKey, grid) {
        // use saveGrid

        // For now use send_command instead of lpush so that
        // we can push the entire array into redis
        grid.unshift(hashKey);
        redis.send_command("lpush", grid, function(err, res) {
            if (err) {
                console.error("Problem pushing grid into redis");
            }
        });
        
    },

    _setGridSize: function(hashKey, width, height) {
        // use saveGrid
        redis.hset(hashKey + this._META_KEY, this._BOARD_WIDTH_KEY, width, function(err, res) {
            if (err) {
                console.error("Problem setting width side of the grid on redis");
            }
        });
        redis.hset(hashKey + this._META_KEY, this._BOARD_HEIGHT_KEY, height, function(err, res) {
           if (err) {
                console.error("Problem setting height size of the grid on redis");
           } 
        });
    },

    destroyGrid: function(hashKey) {
        /**
         * Deletes the grid any anything that uses the same hashkey
         */
        redis.del(hashKey + _META_KEY);
        redis.del(hashKey);
    },

    resetExpireOnKey: function(hashKey) {
        redis.expire(hashKey, this._EXPIRE_TIME);
        redis.expire(hashKey + this._META_KEY, this._EXPIRE_TIME);
    },

    flushDB: function() {
        redis.flushdb();
    }
}


var utils = {
    _getPlayerHash: function(player) {
        var playerHash = 0;
        _.each(player, function(c) {
            playerHash += c.charCodeAt(0);
        });
        return playerHash;
    },
    /**
     * TODO:This will probably work without p1 and p2 also...
     * just need to add some random variable.
     */
    generateHashKey: function(player1, player2) {
        var playerHash = 0;
        playerHash += this._getPlayerHash(player1);
        playerHash += this._getPlayerHash(player2);
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
        return shuffledCards;
    },

    translateIndex: function(row, col, width, height) {
        return (row * width) + col;
    },

    translatePosition: function(index, width, height, callback) {
        var row = index / width;
        var col = index % width;
        callback(row, col);
    }
}

var exports = {
    newGame: function(boardSize, player1, player2) {
        // TODO: Remove this.. don't want to keep purging redis unless we dont want anyone
        // to win! :D
        this.purgeRedis();
        var grid = utils.generateGrid(boardSize, boardSize);
        var hashKey = utils.generateHashKey(player1, player2);

        redisUtil.saveGrid(hashKey, grid, boardSize, boardSize);
        return hashKey;
    },

    getIconAtPosition: function(hashKey, row, col, callback) {
        // TODO: do we really need to get the whole grid..?
        // TODO: There has to be a way to only request from redis once b/c
        //       We will be hitting this code so very often, not really practical
        //       to make two calls.
         redisUtil.getGridSize(hashKey, function(width, height) {
            redisUtil.getGrid(hashKey, function(grid) {
                var pos = utils.translateIndex(row, col, width, height);
                callback(grid[pos]);
            });
        });
    },

    prettyPrintGrid: function(hashKey, callback) {
        var retval = "";
        
        // TODO: consider using .multi here.
        // TODO: i think im mixing up row/col width/height..
        redisUtil.getGridSize(hashKey, function(width, height) {
            redisUtil.getGrid(hashKey, function(grid) {
                for (var i = 0; i < width; i++) {
                    for (var j = 0; j < height; j++) {
                        var pos = utils.translateIndex(i, j, width, height);
                        retval += grid[pos] + "  ";
                    }
                    retval += "<br/>";
                }
                callback(retval);
            });
        });  
    },

    purgeRedis: function() {
        // TODO: Remove this later.. don't want to be able to purge the DB
        redisUtil.flushDB();
    },
};


module.exports = exports;
