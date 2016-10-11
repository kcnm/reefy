import * as React from 'react';

import Key from '../../common/Key';
import CursorStore from '../../stores/CursorStore';


export default function(ev: React.KeyboardEvent) {
  let key = ev.key;
  switch (key) {
    case Key.SHIFT:
      CursorStore.exitVisual();
      break;
    default:
  }
};
