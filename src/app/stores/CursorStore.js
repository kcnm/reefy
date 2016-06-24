var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');


var POSITION_CHANGE_EVENT = 'position change';

var _pos = {
  row: 0,
  col: 0
};

var CursorStore = assign({}, EventEmitter.prototype, {

  getPosition: function() {
    return _pos;
  },

  addPositionChangeListener: function(callback) {
    this.on(POSITION_CHANGE_EVENT, callback);
  },

  removePositionChangeListener: function(callback) {
    this.removeListener(POSITION_CHANGE_EVENT, callback);
  },

  moveTo: function(row, col) {
    _pos.row = row;
    _pos.col = col;
    this.emit(POSITION_CHANGE_EVENT);
  }

});

module.exports = CursorStore;
