import CursorPosition from '../types/CursorPosition';
import CursorPositionPx from '../types/CursorPositionPx';
import ConfigStore from './ConfigStore';
import FileStore from './FileStore';


let _pos = {
  row: 0,
  col: 0,
};

let _vis = {
  active: false,
  select: false,
  begin: {
    row: 0,
    col: 0,
  },
};

let CursorStore = {

  getPosition: function() {
    return _pos;
  },

  getPositionByPx: function(posPx: CursorPositionPx) {
    let lines = FileStore.getLines();
    let row = Math.floor(posPx.y / ConfigStore.getConfig().lineHeight);
    if (row >= lines.length) {
      row = lines.length - 1;
      return {row: row, col: lines[row].length};
    }

    let col = 0;
    let line = lines[row];
    let width = ConfigStore.getLineWidth(line);
    if (posPx.x > width) {
      col = line.length;
    } else {
      let minDist = posPx.x;
      for (let i = 1; i < line.length; ++i) {
        let p = ConfigStore.getLineWidth(line.substring(0, i));
        let d = Math.abs(posPx.x - p);
        if (d < minDist) {
          minDist = d;
          col = i;
        }
      }
    }
    return {row: row, col: col};
  },

  getPositionPx: function() {
    let lines = FileStore.getLines();
    let row = Math.min(lines.length - 1, _pos.row);
    let col = Math.min(lines[_pos.row].length, _pos.col);
    return {
      x: ConfigStore.getLineWidth(lines[row].slice(0, col)),
      y: ConfigStore.getConfig().lineHeight * row,
    }
  },

  getSelection: function() {
    if (!_vis.select) {
      return null;
    }
    let begin = _vis.begin;
    let end = _pos;
    if (begin.row < end.row || (begin.row == end.row && begin.col < end.col)) {
      return {begin: begin, end: end};
    } else {
      return {begin: end, end: begin};
    }
  },

  moveTo: function(pos: CursorPosition) {
    _pos.row = pos.row;
    _pos.col = pos.col;
    _vis.select = _vis.active;
  },

  moveToLast: function() {
    let lines = FileStore.getLines();
    let row = lines.length - 1;
    this.moveTo({row: row, col: lines[row].length});
  },

  moveHorz: function(colDiff: number) {
    let lines = FileStore.getLines();
    let row = _pos.row;
    let col = _pos.col + colDiff;
    // Moves to lines above if necessary.
    while (row > 0 && col < 0) {
      col += lines[row--].length + 1;
    }
    col = Math.max(col, 0);
    // Move to lines below if necessary.
    while (row < lines.length - 1 && col > lines[row].length) {
      col -= lines[row++].length + 1;
    }
    col = Math.min(col, lines[row].length || 0);
    this.moveTo({row: row, col: col});
  },

  moveVert: function(rowDiff: number) {
    let lines = FileStore.getLines();
    let row = _pos.row + rowDiff;
    row = Math.max(row, 0);
    row = Math.min(row, lines.length - 1);
    let col = Math.min(_pos.col, lines[row].length);
    this.moveTo({row: row, col: col});
  },

  isInVisual: function() {
    return _vis.active;
  },

  enterVisual: function() {
    _vis.active = true;
    _vis.begin = {
      row: _pos.row,
      col: _pos.col,
    };
  },

  exitVisual: function() {
    _vis.active = false;
  },

  selectAll: function() {
    _vis.begin = {
      row: 0,
      col: 0,
    };
    _vis.active = true;
    this.moveToLast();
    _vis.active = false;
  },

  getSelectedText: function() {
    let sel = this.getSelection();
    if (!sel) {
      return '';
    }
    let lines = FileStore.getLines();
    if (sel.begin.row == sel.end.row) {
      return lines[sel.begin.row].slice(sel.begin.col, sel.end.col);
    }
    let beginLine = lines[sel.begin.row].slice(sel.begin.col);
    let midLines = lines.slice(sel.begin.row + 1, sel.end.row).join('\n');
    let endLine = lines[sel.end.row].slice(0, sel.end.col);
    return beginLine + '\n' + midLines + (midLines ? '\n' : '') + endLine;
  },

  clearSelection: function() {
    _vis.select = false;
    _vis.begin = {
      row: _pos.row,
      col: _pos.col,
    };
  },

};

export default CursorStore;
