import { ConfigStore } from '../stores/ConfigStore';
import { CursorStore } from '../stores/CursorStore';
import { FileStore } from '../stores/FileStore';


export var ClickOnCodeLineAction = {

  create: function(x: number, row: number) {
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
