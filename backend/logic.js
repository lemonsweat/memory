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

    getPlayerHash: function(player) {
        var playerHash = 0;
        _.each(player, function(c) {
            playerHash += c.charCodeAt(0);
        });
        return playerHash;
    },

    getGridElemAtIndex: function(hashKey, index, callback) {
        redis.lindex(hashKey, index, callback);
    },

    getGridSize: function(hashKey, callback) {
        redis.hmget(hashKey + "xx", this._BOARD_HEIGHT_KEY, this._BOARD_WIDTH_KEY, function(err, boardSize) {
            callback(boardSize[0], boardSize[1]);
        });
    },

    getGrid: function(hashKey, callback) {
        redis.lrange(hashKey, 0, -1, function(err, grid) {
            callback(grid);
        });
    },

    saveGrid: function(hashKey, grid, width, height) {
        this._setGrid(hashKey, grid);
        this._setGridSize(hashKey, width, height);
    },

    _setGrid: function(hashKey, grid) {
        // use saveGrid
        // TODO: FIXTHIS: flatten grid to push the whole list at once.
        //      has to be a way to push an entire list without having to
        //      push it one elment at a time. This should fix bug where
        //      we're lpushing an array.                
        redis.lpush(hashKey, grid, function(status, err) {
            console.log("grid status:", status);
            console.log("error!! ", err);
        });
    },

    _setGridSize: function(hashKey, width, height) {
        // use saveGrid
        redis.hset(hashKey+"xx", this._BOARD_WIDTH_KEY, width, function(status, err) {
            console.log("width status:", status);
            console.log("error!! ", err);
        });
        redis.hset(hashKey+"xx", this._BOARD_HEIGHT_KEY, height, function(status, err) {
            console.log("height status:", status);
            console.log("error!! ", err);
        });
    },

    destroyGrid: function(hashKey) {
        /**
         * Deletes the grid any anything that uses the same hashkey
         */
        redis.hdel(hashKey+"xx", this._BOARD_HEIGHT_KEY, this._BOARD_WIDTH_KEY);
        redis.ldel(hashKey);
    },
}


var utils = {
    /**
     * TODO:This will probably work without p1 and p2 also...
     * just need to add some random variable.
     */
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
        console.log(shuffledCards);
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
        var grid = utils.generateGrid(boardSize, boardSize);
        var hashKey = utils.generateHashKey(player1, player2);
        // TODO: remove this once stuff works
        var hashKey = "superman";

        redisUtil.saveGrid(hashKey, grid, boardSize, boardSize);
        return hashKey;
    },

    getIconAtPosition: function(hashKey, row, col, callback) {
        redisUtil.getGrid(hashKey, function(list) {
            
        });
    },

    prettyPrintGrid: function(hashKey, callback) {
        var retval = "";
        
        // TODO: consider using .multi here.
        // TODO: i think im mixing up row/col width/height..
        redisUtil.getGridSize(hashKey, function(width, height) {
            console.log("width, height ", width, height);
            redisUtil.getGrid(hashKey, function(grid) {
                console.log(grid);
                for (var i = 0; i < width; i++) {
                    for (var j = 0; j < height; j++) {
                        var pos = utils.translateIndex(i, j, width, height);
                        // console.log("pos: ", pos);
                        // console.log("grid: ", typeof(grid));
                        // console.log("grid pos: ", grid[pos]);
                        retval += grid[pos] + "  ";
                    }
                    retval += "<br/>";
                }
                callback(retval);
            });
        });

        
    }
};


module.exports = exports;
