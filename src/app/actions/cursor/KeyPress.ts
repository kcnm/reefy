import * as React from 'react';

import Key from '../../common/Key';
import CursorStore from '../../stores/CursorStore';
import insert from '../Insert';


export default function(ev: React.KeyboardEvent) {
  ev.preventDefault();
  let key = ev.key;
  insert(key == Key.ENTER ? '\n' : key);
  // Removes possible selection for upper characters.
  CursorStore.clearSelection();
};
