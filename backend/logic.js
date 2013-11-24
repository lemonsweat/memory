var _ = require('underscore');

var exports = {
  _SEED: 123123137,

  /**
   * Generates the game hash value based on the players
   */
  generateGameHash: function(boardSize) {
    // TODO: Refactor to do something faster and smarter..
    var totalCards = boardSize * boardSize;
    var totalUniqueCards = totalCards / 2;
    var cardsAvailable = [];

    for (var card = 0; card < totalUniqueCards; card++) {
        for (var i = 0; i < 2; i++) {
            cardsAvailable.push(card);
        }
    }

    // TODO:might be expensive..
    var grid = _.range(totalCards);

    var hashCode = 0;
    var bitsToUse = exports._getBits(boardSize);
    console.log(bitsToUse);

    var count = 0;
    _.each(grid, function(entry) {
        var randIndex = Math.floor(Math.random() * _.size(cardsAvailable));
        entry = cardsAvailable.pop(randIndex);
        hashCode |= entry << (bitsToUse * count);
        count ++;
        console.log("calc: " + hashCode);
    });

    return hashCode;

  },

  _decode: function(hashCode, boardSize, x, y) {
    var bitsToUse = exports._getBits(boardSize);

    var mask = 0;
    for (var i = 0; i < bitsToUse; i++) {
        mask |= 1 << i;
    }

    var pos = (x * boardSize) + y;
    var offset = bitsToUse * pos;

    return (hashCode >> offset) & mask;
  },

  _getBits: function(boardSize) {
    return Math.ceil(Math.log(boardSize)/Math.log(2));
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

    return exports._decode(hashCode, boardSize, x, y);
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
