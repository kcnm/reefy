var React = require('react');

var CodeLine = require('./CodeLine.jsx');
var Cursor = require('./Cursor.jsx');

export var CodeArea = React.createClass({
  getInitialState: function() {
    return {
      cursorPosition: {
        r:0,  // Row, starting from 0.
        c:0,  // Column, starting from 0.
        x:0,  // Pixels to the left.
        y:0  // Pixels to top.
      },
      lines: this.props.code.split('\n')
    };
  },

  moveCursor: function(r, c, x, y) {
    this.setState({
      cursorPosition: {r:r, c:c, x:x, y:y},
    });
  },

  insert: function(key) {
    var pos = this.state.cursorPosition;
    var line = this.state.lines[pos.r];
    this.state.lines[pos.r] = line.slice(0, pos.c) + key + line.slice(pos.c);
    pos.c += 1;
    pos.x = this.computeLineWidth(this.state.lines[pos.r].slice(0, pos.c));
    this.setState({
      cursorPosition: pos,
      lines: this.state.lines
    });
  },

  computeLineWidth: function(line) {
    var style = this.props.inlineStyle;
    var ctx = document.createElement('canvas').getContext('2d');
    ctx.font = style.fontSize + 'px ' + style.fontFamily;
    return ctx.measureText(line).width;
  },

  handleClick: function(event) {
    var h = this.props.inlineStyle.lineHeight;
    var n = this.state.lines.length;
    this.moveCursor(n, 0, 0, h * (n - 1));
  },

  render: function() {
    var codeLines = this.state.lines.map(function(line, idx) {
      return (
        <CodeLine.CodeLine key={idx}
            lineNum={idx}
            code={line}
            lineHeight={this.props.inlineStyle.lineHeight}
            computeLineWidth={this.computeLineWidth}
            moveCursor={this.moveCursor} />
      );
    }.bind(this));

    var style = {
      fontSize: this.props.inlineStyle.fontSize,
      fontFamily: this.props.inlineStyle.fontFamily,
      lineHeight: this.props.inlineStyle.lineHeight + 'px'
    };

    return (
      <div className="code-area" style={style}>
        <Cursor.Cursor
          inlineStyle={this.props.inlineStyle}
          position={this.state.cursorPosition}
          insert={this.insert} />
        {codeLines}
      </div>
    );
  }
});
