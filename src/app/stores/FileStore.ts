import CursorPosition from '../types/CursorPosition';
import CursorSelection from '../types/CursorSelection';
import ConfigStore from './ConfigStore';


let _lines = ['\thello', 'w\torld'];

let FileStore = {

  getLines: function() {
    return _lines;
  },

  getCol: function(row: number, charIndex: number) {
    let tabSize = ConfigStore.getConfig().tabSize;
    let segments = _lines[row].split('\t');
    let idx = segments[0].length;
    let col = segments[0].length;
    for (let seg of segments.slice(1)) {
      if (charIndex <= idx) {
        return col - (idx - charIndex);
      }
      idx += 1 + seg.length;
      col += tabSize - col % tabSize + seg.length;
    }
    return col - (idx - charIndex);
  },

  getExpandedLine: function(row: number) {
    let maxCol = _lines[row].length * ConfigStore.getConfig().tabSize;
    return this.expandLineTo({row: row, col: maxCol}, 0).expanded;
  },

  expandLineTo: function(pos: CursorPosition, rndDir: number) {
    let tabSize = ConfigStore.getConfig().tabSize;
    let segments = _lines[pos.row].split('\t');
    let expanded = segments[0];
    let idx = segments[0].length;
    for (let seg of segments.slice(1)) {
      if (pos.col <= expanded.length) {
        return {
          charIndex: idx - (expanded.length - pos.col),
          expanded: expanded.substring(0, pos.col),
        };
      }
      let shift = tabSize - expanded.length % tabSize;
      let fill = new Array(shift + 1).join(' ');
      if (pos.col < expanded.length + shift) {
        let rndDown = pos.col - expanded.length <= shift / 2;
        if (rndDir < 0 || (rndDir == 0 && rndDown)) {
          return {
            charIndex: idx,
            expanded: expanded,
          };
        } else {
          return {
            charIndex: idx + 1,
            expanded: expanded + fill,
          };
        }
      }
      expanded += fill + seg;
      idx += 1 + seg.length;
    }
    return {
      charIndex: idx - (expanded.length - pos.col),
      expanded: expanded.substring(0, pos.col),
    };
  },

  insert: function(pos: CursorPosition, text: string) {
    let lines = text.split('\n');
    let nseg = lines.length;
    let line = _lines[pos.row];
    // Inserts text in a single line.
    if (nseg == 1) {
      _lines[pos.row] =
          line.substring(0, pos.col) + lines[0] + line.substring(pos.col);
      return {
        row: pos.row,
        col: pos.col + lines[0].length,
      };
    }
    // Inserts multiple lines.
    _lines.splice(pos.row, 1,
        line.substring(0, pos.col) + lines[0],
        ...lines.slice(1, nseg - 1),
        lines[nseg - 1] + line.substring(pos.col));
    return {
      row: pos.row + nseg - 1,
      col: lines[nseg - 1].length,
    };
  },

  remove: function(pos: CursorPosition) {
    let line = _lines[pos.row];
    if (pos.col < 0) {
      _lines.splice(pos.row - 1, 2, (_lines[pos.row - 1] || '') + line);
    } else if (pos.col >= line.length) {
      _lines.splice(pos.row, 2, line + (_lines[pos.row + 1] || ''));
    } else {
    _lines[pos.row] =
        line.substring(0, pos.col) + line.substring(pos.col + 1);
    }
  },

  removeSelection: function(sel: CursorSelection) {
    if (sel) {
      let beginLine = _lines[sel.begin.row];
      let endLine = _lines[sel.end.row];
      _lines.splice(
          sel.begin.row,
          sel.end.row - sel.begin.row + 1,
          beginLine.substring(0, sel.begin.col) +
              endLine.substring(sel.end.col));
    }
  },

};

export default FileStore;
