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
        return CursorStore.moveVert(-1);
      case Key.DOWN:
        return CursorStore.moveVert(1);
      case Key.LEFT:
        return CursorStore.moveHorz(-1);
      case Key.RIGHT:
        return CursorStore.moveHorz(1);
      case Key.HOME:
        var pos = CursorStore.getPosition();
        return CursorStore.moveTo(pos.row, 0);
      case Key.END:
        var pos = CursorStore.getPosition();
        var line = FileStore.getLines()[pos.row];
        return CursorStore.moveTo(pos.row, line ? line.length : 0);
      case Key.BACKSPACE:
        var pos = CursorStore.getPosition();
        return CursorStore.moveHorz(-1).then(function() {
          return FileStore.remove(pos.row, pos.col);
        });
      case Key.DELETE:
        var pos = CursorStore.getPosition();
        return FileStore.remove(pos.row, pos.col);
      case Key.SHIFT:
        return CursorStore.enterVisual();
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
        return CursorStore.moveHorz(1);
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
      case Key.BACKSPACE:
      case Key.DELETE:
        return Promise.resolve(key);
      case Key.SHIFT:
        return CursorStore.exitVisual();
      default:
        return Promise.reject('Unimplemented cursor key up event: ' + event);
    }
  }

};

module.exports = KeyOnCursorAction;
