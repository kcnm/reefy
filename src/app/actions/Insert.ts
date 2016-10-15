import FileStore from '../stores/FileStore';
import CursorStore from '../stores/CursorStore';
import removeSelection from './RemoveSelection';


export default function(text: string) {
  removeSelection();
  let pos = CursorStore.getPosition();
  pos = FileStore.insert(pos, text);
  CursorStore.moveTo(pos, text.length);
};
