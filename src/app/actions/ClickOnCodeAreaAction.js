var CursorStore = require('../stores/CursorStore');
var FileStore = require('../stores/FileStore');


var ClickOnCodeAreaAction = {

  create: function(x, y) {
    CursorStore.moveToLast();
  }

};

module.exports = ClickOnCodeAreaAction;
