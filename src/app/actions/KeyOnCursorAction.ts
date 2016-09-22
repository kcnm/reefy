import * as React from 'react';

import KeyEvent from '../types/KeyEvent';
import CursorStore from '../stores/CursorStore';
import FileStore from '../stores/FileStore';


let Key = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  ENTER: 'Enter',
  BACKSPACE: 'Backspace',
  DELETE: 'Delete',
  SHIFT: 'Shift',
};

let KeyOnCursorAction = {

  create: function(event: React.KeyboardEvent, type: KeyEvent) {
    switch (type) {
      case KeyEvent.Down:
        this.createKeyDown(event);
        break;
      case KeyEvent.Press:
        this.createKeyPress(event);
        break;
      case KeyEvent.Up:
        this.createKeyUp(event);
        break;
      default:
        console.error('Unrecognized key event type', type);
    }
  },

  createKeyDown(event: React.KeyboardEvent) {
    if (event.ctrlKey) {
      switch (event.keyCode) {
        case 65:  // ctrl+a
          CursorStore.selectAll();
          break;
      }
      return;
    }
    let key = event.key;
    let pos = CursorStore.getPosition();
    switch (key) {
      case Key.UP:
        CursorStore.moveVert(-1);
        break;
      case Key.DOWN:
        CursorStore.moveVert(1);
        break;
      case Key.LEFT:
        CursorStore.moveHorz(-1);
        break;
      case Key.RIGHT:
        CursorStore.moveHorz(1);
        break;
      case Key.HOME:
        CursorStore.moveTo(pos.row, 0);
        break;
      case Key.END:
        let line = FileStore.getLines()[pos.row];
        CursorStore.moveTo(pos.row, line ? line.length : 0);
        break;
      case Key.BACKSPACE:
        if (!this._maybeRemoveSelection()) {
          pos = CursorStore.getPosition();
          CursorStore.moveHorz(-1);
          FileStore.remove(pos.row, pos.col);
        }
        break;
      case Key.DELETE:
        if (!this._maybeRemoveSelection()) {
          pos = CursorStore.getPosition();
          FileStore.remove(pos.row, pos.col);
        }
        break;
      case Key.SHIFT:
        CursorStore.enterVisual();
        break;
      default:
        console.error('Unimplemented cursor key down event', event);
    }
  },

  createKeyPress(event: React.KeyboardEvent) {
    let key = event.key;
    this._maybeRemoveSelection();
    let pos = CursorStore.getPosition();
    if (key == Key.ENTER) {
      FileStore.insertEnter(pos.row, pos.col);
      CursorStore.moveTo(pos.row + 1, 0);
    } else {
      FileStore.insert(pos.row, pos.col, key);
      CursorStore.moveHorz(1);
    }
    // Removes possible selection for upper characters.
    CursorStore.clearSelection();
  },

  createKeyUp(event: React.KeyboardEvent) {
    let key = event.key;
    switch (key) {
      case Key.UP:
      case Key.DOWN:
      case Key.LEFT:
      case Key.RIGHT:
      case Key.HOME:
      case Key.END:
      case Key.BACKSPACE:
      case Key.DELETE:
        break;
      case Key.SHIFT:
        CursorStore.exitVisual();
        break;
      default:
        console.error('Unimplemented cursor key up event', event);
    }
  },

  _maybeRemoveSelection: function() {
    let sel = CursorStore.getSelection();
    if (sel) {
      FileStore.removeSelection(sel);
      CursorStore.clearSelection();
      CursorStore.moveTo(sel.begin.row, sel.begin.col);
      return true;
    }
    return false;
  },

};

export default KeyOnCursorAction;
