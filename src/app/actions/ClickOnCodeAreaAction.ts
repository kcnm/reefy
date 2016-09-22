import CursorStore from '../stores/CursorStore';
import FileStore from '../stores/FileStore';


let ClickOnCodeAreaAction = {

  create: function() {
    CursorStore.moveToLast();
  },

};

export default ClickOnCodeAreaAction;
