var ConfigStore = require('../stores/ConfigStore');
var CursorStore = require('../stores/CursorStore');
var FileStore = require('../stores/FileStore');


var ClickOnCodeLineAction = {

  create: function(x, row) {
    var line = FileStore.getLines()[row];
    var col = 0;
    var width = ConfigStore.getLineWidth(line);
    if (x > width) {
      col = line.length;
    } else {
      var minDist = x;
      for (var i = 1; i < line.length; ++i) {
        var p = ConfigStore.getLineWidth(line.substring(0, i));
        var d = Math.abs(x - p);
        if (d < minDist) {
          minDist = d;
          col = i;
        }
      }
    }
    CursorStore.moveTo(row, col);
  }

};

module.exports = ClickOnCodeLineAction;
