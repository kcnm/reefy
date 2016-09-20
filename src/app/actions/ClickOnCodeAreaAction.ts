import { CursorStore } from '../stores/CursorStore';
import { FileStore } from '../stores/FileStore';


export var ClickOnCodeAreaAction = {

  create: function() {
    CursorStore.moveToLast();
  }

};
