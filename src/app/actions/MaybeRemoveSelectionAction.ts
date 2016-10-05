import CursorStore from '../stores/CursorStore';
import FileStore from '../stores/FileStore';


export default function() {
  let sel = CursorStore.getSelection();
  if (sel) {
    FileStore.removeSelection(sel);
    CursorStore.clearSelection();
    CursorStore.moveTo(sel.begin.row, sel.begin.col);
    return true;
  }
  return false;
};
