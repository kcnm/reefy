import * as React from 'react';

import Key from '../../common/Key';
import FileStore from '../../stores/FileStore';
import CursorStore from '../../stores/CursorStore';
import removeSelection from '../RemoveSelection';


export default function(ev: React.KeyboardEvent) {
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
      CursorStore.moveHorz(-pos.col);
      break;
    case Key.END:
      let line = FileStore.getLines()[pos.row];
      CursorStore.moveHorz(line.length - pos.col);
      break;
    case Key.BACKSPACE:
      if (!removeSelection()) {
        pos = CursorStore.getPosition();
        CursorStore.moveHorz(-1);
        FileStore.remove(pos);
      }
      break;
    case Key.DELETE:
      if (!removeSelection()) {
        pos = CursorStore.getPosition();
        FileStore.remove(pos);
      }
      break;
    case Key.SHIFT:
      CursorStore.enterVisual();
      break;
    default:
  }
};
