
var _pos = {
  row: 0,
  col: 0
};

var CursorStore = {

  getPosition: function() {
    return _pos;
  },

  moveTo: function(row, col) {
    _pos.row = row;
    _pos.col = col;
    return Promise.resolve(_pos);
  }

};

module.exports = CursorStore;
