import CursorPosition from '../types/CursorPosition';
import CursorSelection from '../types/CursorSelection';
import ConfigStore from './ConfigStore';


let _lines = ['hello', 'world'];

let FileStore = {

  getLines: function() {
    return _lines;
  },

  insert: function(pos: CursorPosition, text: string) {
    let segments = text.split('\n');
    let nseg = segments.length;
    let line = _lines[pos.row];
    // Inserts text in a single line.
    if (nseg == 1) {
      _lines[pos.row] =
          line.slice(0, pos.col) + segments[0] + line.slice(pos.col);
      return {
        row: pos.row,
        col: pos.col + segments[0].length,
      };
    }
    // Inserts multiple lines.
    _lines.splice(pos.row, 1,
        line.slice(0, pos.col) + segments[0],
        ...segments.slice(1, nseg - 1),
        segments[nseg - 1] + line.slice(pos.col));
    return {
      row: pos.row + nseg - 1,
      col: segments[nseg - 1].length,
    };
  },

  remove: function(pos: CursorPosition) {
    let line = _lines[pos.row];
    if (pos.col < 0) {
      _lines.splice(pos.row - 1, 2, (_lines[pos.row - 1] || '') + line);
    } else if (pos.col >= line.length) {
      _lines.splice(pos.row, 2, line + (_lines[pos.row + 1] || ''));
    } else {
      _lines[pos.row] = line.slice(0, pos.col) + line.slice(pos.col + 1);
    }
  },

  removeSelection: function(sel: CursorSelection) {
    if (sel) {
      let beginLine = _lines[sel.begin.row];
      let endLine = _lines[sel.end.row];
      _lines.splice(
          sel.begin.row,
          sel.end.row - sel.begin.row + 1,
          beginLine.slice(0, sel.begin.col) + endLine.slice(sel.end.col));
    }
  },

};

export default FileStore;
