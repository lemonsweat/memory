var _ = require('underscore');

var exports = {
  _SEED: 123123137,

  /**
   * Generates the game hash value based on the players
   */
  generateGameHash: function(player1, player2) {
    var playerNames = 0;

    _.each(player1, function(c) {
      playerNames += c.charCodeAt(0);
    });

    _.each(player2, function(c) {
      playerNames += c.charCodeAt(0);
    });

    var playerNamesSeed = (playerNames * Math.random()) * exports._SEED;

    return exports.makeHash(playerNamesSeed % Number.MAX_VALUE);


  },

  /**
   * gets the card id based on the hash code, row, and col
   */
  getCard: function(hashCode, boardSize, x, y) {
    var number = exports.convertHashToNumber(hashCode);

    var totalCards = boardSize * boardSize;

    if (totalCards % 2) {
      // dont have an even number of cards.. there's a card that doesnt have a
      // pair if this is the case
      return false;
    }

    if ((x > boardSize - 1) || (y > boardSize - 1) || (x < 0) || (y < 0)) {
      return false;
    }

    console.log("hash number: " + number);
    console.log("total cards: " + totalCards);
    console.log("num % card : " + number % totalCards);

    var board = ((number % totalCards) + ( (x * boardSize)  + y)) % (totalCards / 2);

    return board
  },

  makeSolutionGrid: function(hashCode, boardSize) {
    var retval = "";
    for (i = 0; i < boardSize; i++) {
      for (j = 0; j < boardSize; j++) {
        retval += exports.getCard(hashCode, boardSize, i, j) + "  ";
      }
      retval += "<br/>"
    }
    return retval;
  },

  /**
   * Just what the method name is. This can be changed to something
   * more complicated later..
   */
  convertHashToNumber: function(hash) {
    return parseInt(hash, 16);
  },

  /**
   * Generates the actual hash code given an integer. This
   * is just the java hash function
   */
  makeHash: function(i) {
    i ^= (i >>> 20) ^ (i >>> 12);
    i = i ^ (i >>> 7) ^ (i >>> 4);

    return Math.abs(i).toString(16);

    // return ((i>>16)&0xFF).toString(16) +
    //     ((i>>8)&0xFF).toString(16) +
    //     (i&0xFF).toString(16);
    }

};


module.exports = exports;
