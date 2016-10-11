import CursorStore from '../stores/CursorStore';
import FileStore from '../stores/FileStore';


export default function() {
  let sel = CursorStore.getSelection();
  if (sel) {
    FileStore.removeSelection(sel);
    CursorStore.clearSelection();
    CursorStore.moveTo(sel.begin);
    return true;
  }
  return false;
};
