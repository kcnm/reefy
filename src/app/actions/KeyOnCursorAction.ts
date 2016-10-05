import * as React from 'react';

import Key from '../common/Key';

import KeyEvent from '../types/KeyEvent';

import CursorStore from '../stores/CursorStore';
import FileStore from '../stores/FileStore';

import maybeRemoveSelection from './MaybeRemoveSelectionAction';
import insert from './InsertAction';


let _createKeyDown = (ev: React.KeyboardEvent) => {
  if (ev.ctrlKey) {
    switch (ev.keyCode) {
      case 65:  // ctrl+a
        CursorStore.selectAll();
        break;
    }
    return;
  }
  let key = ev.key;
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
      if (!maybeRemoveSelection()) {
        pos = CursorStore.getPosition();
        CursorStore.moveHorz(-1);
        FileStore.remove(pos.row, pos.col);
      }
      break;
    case Key.DELETE:
      if (!maybeRemoveSelection()) {
        pos = CursorStore.getPosition();
        FileStore.remove(pos.row, pos.col);
      }
      break;
    case Key.SHIFT:
      CursorStore.enterVisual();
      break;
    default:
  }
};

let _createKeyPress = (ev: React.KeyboardEvent) => {
  let key = ev.key;
  insert(key == Key.ENTER ? '\n' : key);
  // Removes possible selection for upper characters.
  CursorStore.clearSelection();
};

let _createKeyUp = (ev: React.KeyboardEvent) => {
  let key = ev.key;
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
  }
};

export default function(ev: React.KeyboardEvent, type: KeyEvent) {
  switch (type) {
    case KeyEvent.Down:
      _createKeyDown(ev);
      break;
    case KeyEvent.Press:
      _createKeyPress(ev);
      break;
    case KeyEvent.Up:
      _createKeyUp(ev);
      break;
    default:
  }
};
