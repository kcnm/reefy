var CursorStore = require('../stores/CursorStore');
var FileStore = require('../stores/FileStore');


var Key = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  ENTER: 'Enter',
  BACKSPACE: 'Backspace',
  DELETE: 'Delete',
  SHIFT: 'Shift'
};

var KeyOnCursorAction = {

  KEY_DOWN: 'Key Down',
  KEY_PRESS: 'Key Press',
  KEY_UP: 'Key Up',

  create: function(event, type) {
    switch (type) {
      case this.KEY_DOWN:
        return this.createKeyDown(event);
      case this.KEY_PRESS:
        return this.createKeyPress(event);
      case this.KEY_UP:
        return this.createKeyUp(event);
      default:
        return Promise.reject('Unrecognized key event type: ' + type);
    }
  },

  createKeyDown(event) {
    var key = event.key;
    switch (key) {
      case Key.UP:
        return CursorStore.move(-1, 0);
      case Key.DOWN:
        return CursorStore.move(1, 0);
      case Key.LEFT:
        return CursorStore.move(0, -1);
      case Key.RIGHT:
        return CursorStore.move(0, 1);
      case Key.HOME:
        var pos = CursorStore.getPosition();
        return CursorStore.moveTo(pos.row, 0);
      case Key.END:
        var pos = CursorStore.getPosition();
        var line = FileStore.getLines()[pos.row];
        return CursorStore.moveTo(pos.row, line ? line.length : 0);
      default:
        return Promise.reject('Unimplemented cursor key down event: ' + event);
    }
  },

  createKeyPress(event) {
    var key = event.key;
    var pos = CursorStore.getPosition();
    if (key == Key.ENTER) {
      return FileStore.insertEnter(pos.row, pos.col).then(function() {
        return CursorStore.moveTo(pos.row + 1, 0);
      });
    } else {
      return FileStore.insert(pos.row, pos.col, key).then(function() {
        return CursorStore.move(0, 1);
      });
    }
  },

  createKeyUp(event) {
    var key = event.key;
    switch (key) {
      case Key.UP:
      case Key.DOWN:
      case Key.LEFT:
      case Key.RIGHT:
      case Key.HOME:
      case Key.END:
        return Promise.resolve(key);
      default:
        return Promise.reject('Unimplemented cursor key up event: ' + event);
    }
  }

};

module.exports = KeyOnCursorAction;
