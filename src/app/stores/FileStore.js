
var _lines = ['hello', 'world'];

var FileStore = {

  getLines: function() {
    return _lines;
  },

  insert: function(row, col, key) {
    var line = _lines[row];
    _lines[row] = line.slice(0, col) + key + line.slice(col);
    return Promise.resolve(_lines);
  },

  insertEnter: function(row, col) {
    var line = _lines[row];
    _lines.splice(row, 1, line.slice(0, col), line.slice(col));
    return Promise.resolve(_lines);
  }

};

module.exports = FileStore;
