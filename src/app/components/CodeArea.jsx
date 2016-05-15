var React = require('react');

var CodeLine = require('./CodeLine.jsx');
var Cursor = require('./Cursor.jsx');

export var CodeArea = React.createClass({
  getInitialState: function() {
    return {
      cursorPosition: {
        row: 0,  // Row, starting from 0.
        col: 0,  // Column, starting from 0.
        x: 0,  // Pixels to the left.
        y: 0  // Pixels to top.
      },
      lines: this.props.code.split('\n')
    };
  },

  moveCursorTo: function(row, col) {
    var x = this.computeLineWidth(this.state.lines[row].slice(0, col));
    var y = this.props.inlineStyle.lineHeight * row;
    this.setState({cursorPosition: {row: row, col: col, x: x, y: y}});
    this.area.scrollLeft = x;
  },

  moveCursor: function(direction) {
    var row = this.state.cursorPosition.row;
    var col = this.state.cursorPosition.col;
    switch (direction) {
      case Cursor.Key.UP:
        row = Math.max(0, row - 1);
        this.moveCursorTo(row, Math.min(this.state.lines[row].length, col));
        break;
      case Cursor.Key.DOWN:
        row = Math.min(this.state.lines.length - 1, row + 1);
        this.moveCursorTo(row, Math.min(this.state.lines[row].length, col));
        break;
      case Cursor.Key.LEFT:
        this.moveCursorTo(row, Math.max(0, col - 1));
        break;
      case Cursor.Key.RIGHT:
        this.moveCursorTo(row, Math.min(this.state.lines[row].length, col + 1));
        break;
    }
  },

  insert: function(key) {
    var pos = this.state.cursorPosition;
    var line = this.state.lines[pos.row];
    if (key == Cursor.Key.ENTER) {
      this.state.lines.splice(
          pos.row, 1, line.slice(0, pos.col), line.slice(pos.col));
      this.setState({lines: this.state.lines});
      this.moveCursorTo(pos.row + 1, 0);
    } else {
      this.state.lines[pos.row] =
          line.slice(0, pos.col) + key + line.slice(pos.col);
      this.setState({lines: this.state.lines});
      this.moveCursor(Cursor.Key.RIGHT);
    }
  },

  remove: function(key) {
    var pos = this.state.cursorPosition;
    var line = this.state.lines[pos.row];
    switch (key) {
      case Cursor.Key.BACKSPACE:
        if (pos.col == 0) {
          if (pos.row > 0) {
            this.moveCursorTo(
                pos.row - 1, this.state.lines[pos.row - 1].length);
            this.state.lines.splice(
                pos.row - 1, 2, this.state.lines[pos.row - 1] + line);
          }
        } else {
          this.state.lines[pos.row] =
              line.slice(0, pos.col - 1) + line.slice(pos.col);
          this.moveCursor(Cursor.Key.LEFT);
        }
        break;
      case Cursor.Key.DELETE:
        if (pos.col == line.length) {
          if (pos.row < this.state.lines.length - 1) {
            this.state.lines.splice(
                pos.row, 2, line + this.state.lines[pos.row + 1]);
          }
        } else {
          this.state.lines[pos.row] =
              line.slice(0, pos.col) + line.slice(pos.col + 1);
        }
        break;
    }
    this.setState({lines: this.state.lines});
  },

  computeLineWidth: function(line) {
    var style = this.props.inlineStyle;
    var ctx = document.createElement('canvas').getContext('2d');
    ctx.font = style.fontSize + 'px ' + style.fontFamily;
    return ctx.measureText(line).width;
  },

  handleClick: function(event) {
    this.moveCursorTo(this.state.lines.length - 1, 0);
  },

  render: function() {
    var codeLines = this.state.lines.map(function(line, idx) {
      return (
        <CodeLine.CodeLine key={idx}
            lineNum={idx}
            code={line}
            lineHeight={this.props.inlineStyle.lineHeight}
            computeLineWidth={this.computeLineWidth}
            moveCursorTo={this.moveCursorTo} />
      );
    }.bind(this));

    var style = {
      fontSize: this.props.inlineStyle.fontSize,
      fontFamily: this.props.inlineStyle.fontFamily,
      lineHeight: this.props.inlineStyle.lineHeight + 'px'
    };

    return (
      <div className="code-area" style={style}
          ref={(ref) => this.area = ref }
          onClick={this.handleClick}>
        <Cursor.Cursor
          inlineStyle={this.props.inlineStyle}
          position={this.state.cursorPosition}
          moveCursor={this.moveCursor}
          insert={this.insert}
          remove={this.remove} />
        {codeLines}
      </div>
    );
  }
});
