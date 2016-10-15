import * as React from 'react';

import Key from '../../common/Key';
import FileStore from '../../stores/FileStore';
import CursorStore from '../../stores/CursorStore';
import removeSelection from '../RemoveSelection';
import insert from '../Insert';


export default function(ev: React.KeyboardEvent) {
  if (ev.ctrlKey) {
    switch (ev.keyCode) {
      case 65:  // ctrl+a
        ev.preventDefault();
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
      CursorStore.moveTo({row: pos.row, col: 0});
      break;
    case Key.END:
      let expanded = FileStore.getExpandedLine(pos.row);
      CursorStore.moveTo({row: pos.row, col: expanded.length});
      break;
    case Key.BACKSPACE:
      if (!removeSelection()) {
        pos = CursorStore.getPosition();
        if (pos.row != 0 || pos.col != 0) {
          CursorStore.moveHorz(-1);
          FileStore.remove(pos);
        }
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
    case Key.TAB:
      ev.preventDefault();
      if (ev.shiftKey) {
        let colEaten = FileStore.eatTab(pos);
        CursorStore.moveTo({
          row: pos.row,
          col: Math.max(0, pos.col - colEaten),
        });
        // Removes possible selection.
        CursorStore.clearSelection();
      } else {
        insert('\t');
      }
      break;
    default:
  }
};
