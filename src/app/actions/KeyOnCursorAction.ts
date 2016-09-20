import * as React from 'react';

import { KeyEventType } from '../types';
import { CursorStore } from '../stores/CursorStore';
import { FileStore } from '../stores/FileStore';


export var Key = {
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

export var KeyOnCursorAction = {

  create: function(event: React.KeyboardEvent, type: KeyEventType) {
    switch (type) {
      case KeyEventType.KeyDown:
        this.createKeyDown(event);
        break;
      case KeyEventType.KeyPress:
        this.createKeyPress(event);
        break;
      case KeyEventType.KeyUp:
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
    var key = event.key;
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
        var pos = CursorStore.getPosition();
        CursorStore.moveTo(pos.row, 0);
        break;
      case Key.END:
        var pos = CursorStore.getPosition();
        var line = FileStore.getLines()[pos.row];
        CursorStore.moveTo(pos.row, line ? line.length : 0);
        break;
      case Key.BACKSPACE:
        if (!this._maybeRemoveSelection()) {
          var pos = CursorStore.getPosition();
          CursorStore.moveHorz(-1);
          FileStore.remove(pos.row, pos.col);
        }
        break;
      case Key.DELETE:
        if (!this._maybeRemoveSelection()) {
          var pos = CursorStore.getPosition();
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
    var key = event.key;
    this._maybeRemoveSelection();
    var pos = CursorStore.getPosition();
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
        break;
      case Key.SHIFT:
        CursorStore.exitVisual();
        break;
      default:
        console.error('Unimplemented cursor key up event', event);
    }
  },

  _maybeRemoveSelection: function() {
    var sel = CursorStore.getSelection();
    if (sel) {
      FileStore.removeSelection(sel);
      CursorStore.clearSelection();
      CursorStore.moveTo(sel.begin.row, sel.begin.col);
      return true;
    }
    return false;
  }

};
