import { CursorSelection } from '../types';


var _lines = ['hello', 'world'];

export var FileStore = {

  getLines: function() {
    return _lines;
  },

  insert: function(row: number, col: number, key: string) {
    var line = _lines[row];
    _lines[row] = line.slice(0, col) + key + line.slice(col);
  },

  insertEnter: function(row: number, col: number) {
    var line = _lines[row];
    _lines.splice(row, 1, line.slice(0, col), line.slice(col));
  },

  remove: function(row: number, col: number) {
    var line = _lines[row];
    if (col < 0) {
      _lines.splice(row - 1, 2, (_lines[row - 1] || '') + line);
    } else if (col >= line.length) {
      _lines.splice(row, 2, line + (_lines[row + 1] || ''));
    } else {
      _lines[row] = line.slice(0, col) + line.slice(col + 1);
    }
  },

  removeSelection: function(sel: CursorSelection) {
    if (sel) {
      var beginLine = _lines[sel.begin.row];
      var endLine = _lines[sel.end.row];
      _lines.splice(
          sel.begin.row,
          sel.end.row - sel.begin.row + 1,
          beginLine.slice(0, sel.begin.col) + endLine.slice(sel.end.col));
    }
  }

};
