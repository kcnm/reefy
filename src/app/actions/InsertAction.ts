import CursorStore from '../stores/CursorStore';
import FileStore from '../stores/FileStore';

import maybeRemoveSelection from './MaybeRemoveSelectionAction';


export default function(text: string) {
  maybeRemoveSelection();
  let pos = CursorStore.getPosition();
  pos = FileStore.insert(pos, text);
  CursorStore.moveTo(pos);
};
