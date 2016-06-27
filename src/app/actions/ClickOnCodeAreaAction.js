var CursorStore = require('../stores/CursorStore');
var FileStore = require('../stores/FileStore');


var ClickOnCodeAreaAction = {

  create: function(x, y) {
    var row = FileStore.getLines().length;
    return CursorStore.moveTo(row, 0);
  }

};

module.exports = ClickOnCodeAreaAction;
