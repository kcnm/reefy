var ConfigStore = require('./ConfigStore');


var _lines = ['hello', 'world'];

var FileStore = {

  getLines: function() {
    return _lines;
  },

  getCursorPxPosition: function(row, col) {
    var eof = row >= _lines.length;
    row = Math.min(_lines.length, row);
    col = Math.min(eof ? 0 : _lines[row].length, col);
    return {
      x: eof ? 0 : ConfigStore.getLineWidth(_lines[row].slice(0, col)),
      y: ConfigStore.getConfig().lineHeight * row
    };
  }

};

module.exports = FileStore;
