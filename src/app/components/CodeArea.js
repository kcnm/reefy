var React = require('react');

var ConfigStore = require('../stores/ConfigStore');
var CursorStore = require('../stores/CursorStore');
var FileStore = require('../stores/FileStore');

var ClickOnCodeAreaAction = require('../actions/ClickOnCodeAreaAction');
var ClickOnCodeLineAction = require('../actions/ClickOnCodeLineAction');
var KeyOnCursorAction = require('../actions/KeyOnCursorAction');

var CodeLine = require('./CodeLine');
var Cursor = require('./Cursor');


var CodeArea = React.createClass({

  getInitialState: function() {
    return {
      config: ConfigStore.getConfig(),
      lines: FileStore.getLines(),
      cursorPosition: CursorStore.getPosition()
    };
  },

  handleClick: function(event) {
    event.stopPropagation();
    var e = event.nativeEvent;
    ClickOnCodeAreaAction.create(e.offsetX, e.offsetY).then(
        this._setCursorPosition);
  },

  handleClickOnCodeLine: function(event, lineNum) {
    event.stopPropagation();
    var e = event.nativeEvent;
    ClickOnCodeLineAction.create(e.offsetX, lineNum).then(
        this._setCursorPosition);
  },

  handleKeyOnCursor: function(event, type) {
    KeyOnCursorAction.create(event, type).then(
        this._setLinesAndCursorPosition);
  },

  _setCursorPosition: function() {
    this.setState({
      cursorPosition: CursorStore.getPosition()
    });
  },

  _setLinesAndCursorPosition: function() {
    this.setState({
      lines: FileStore.getLines(),
      cursorPosition: CursorStore.getPosition()
    });
  },

  render: function() {
    var cfg = this.state.config;
    var style = {
      fontSize: cfg.fontSize,
      fontFamily: cfg.fontFamily,
      lineHeight: cfg.lineHeight + 'px'
    };

    var codeLineHandlers = {
      handleClick: this.handleClickOnCodeLine
    };
    var codeLines = this.state.lines.map(function(line, idx) {
      return (
        <CodeLine key={idx}
            lineNum={idx}
            code={line}
            handlers={codeLineHandlers} />
      );
    });

    var cursorHandlers = {
      handleKey: this.handleKeyOnCursor
    };

    return (
      <div className="code-area" style={style}
          onClick={this.handleClick}>
        <Cursor
            config={this.state.config}
            position={this.state.cursorPosition}
            handlers={cursorHandlers} />
        {codeLines}
      </div>
    );
  }

});

module.exports = CodeArea;
