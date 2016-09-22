import ConfigStore from '../stores/ConfigStore';
import CursorStore from '../stores/CursorStore';
import FileStore from '../stores/FileStore';


export default function(x: number, row: number) {
  let line = FileStore.getLines()[row];
  let col = 0;
  let width = ConfigStore.getLineWidth(line);
  if (x > width) {
    col = line.length;
  } else {
    let minDist = x;
    for (let i = 1; i < line.length; ++i) {
      let p = ConfigStore.getLineWidth(line.substring(0, i));
      let d = Math.abs(x - p);
      if (d < minDist) {
        minDist = d;
        col = i;
      }
    }
  }
  CursorStore.moveTo(row, col);
};
