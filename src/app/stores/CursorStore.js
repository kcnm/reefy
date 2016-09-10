var ConfigStore = require('./ConfigStore');
var FileStore = require('./FileStore');


var _pos = {
  row: 0,
  col: 0
};

var _vis = {
  active: false,
  select: false,
  begin: {
    row: 0,
    col: 0
  }
};

var CursorStore = {

  getPosition: function() {
    return _pos;
  },

  getCursorPositionPx: function(row, col) {
    var lines = FileStore.getLines();
    var eof = row >= lines.length;
    row = Math.min(lines.length, row);
    col = Math.min(eof ? 0 : lines[row].length, col);
    return {
      x: eof ? 0 : ConfigStore.getLineWidth(lines[row].slice(0, col)),
      y: ConfigStore.getConfig().lineHeight * row
    };
  },

  getSelection: function() {
    if (!_vis.select) {
      return null;
    }
    var begin = _vis.begin;
    var end = _pos;
    if (begin.row < end.row || (begin.row == end.row && begin.col < end.col)) {
      return {begin: begin, end: end};
    } else {
      return {begin: end, end: begin};
    }
  },

  moveTo: function(row, col) {
    _pos.row = row;
    _pos.col = col;
    _vis.select = _vis.active;
  },

  moveToLast: function() {
    var lines = FileStore.getLines();
    var row = lines.length - 1;
    this.moveTo(row, lines[row].length);
  },

  moveHorz: function(colDiff) {
    var lines = FileStore.getLines();
    var row = _pos.row;
    var col = _pos.col + colDiff;
    // Moves to lines above if necessary.
    while (row >= 0 && col < 0) {
      col += lines[--row].length + 1;
    }
    col = Math.max(col, 0);
    // Move to lines below if necessary.
    while (row < lines.length && col > lines[row].length) {
      col -= lines[row++].length + 1;
    }
    col = Math.min(col, lines[row].length || 0);
    this.moveTo(row, col);
  },

  moveVert: function(rowDiff) {
    var lines = FileStore.getLines();
    var row = _pos.row + rowDiff;
    row = Math.max(row, 0);
    row = Math.min(row, lines.length - 1);
    var col = Math.min(_pos.col, lines[row].length);
    this.moveTo(row, col);
  },

  enterVisual: function() {
    _vis.active = true;
    _vis.begin = {
      row: _pos.row,
      col: _pos.col
    };
  },

  exitVisual: function() {
    _vis.active = false;
  },

  selectAll: function() {
    _vis.begin = {
      row: 0,
      col: 0
    };
    _vis.active = true;
    this.moveToLast();
    _vis.active = false;
  },

  clearSelection: function() {
    _vis.select = false;
  }

};

module.exports = CursorStore;
