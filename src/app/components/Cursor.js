var React = require('react');

var CursorStore = require('../stores/CursorStore');

var KeyOnCursorAction = require('../actions/KeyOnCursorAction');


var Cursor = React.createClass({

  componentDidUpdate: function() {
    this.textarea.focus();
  },

  handleKeyDown: function(event) {
    this.props.handlers.handleKey(event, KeyOnCursorAction.KEY_DOWN);
  },

  handleKeyPress: function(event) {
    event.preventDefault();
    this.props.handlers.handleKey(event, KeyOnCursorAction.KEY_PRESS);
  },

  handleKeyUp: function(event) {
    this.props.handlers.handleKey(event, KeyOnCursorAction.KEY_UP);
  },

  render: function() {
    var cfg = this.props.config;
    var pos = this.props.position;
    var posPx = CursorStore.getCursorPositionPx(pos.row, pos.col);
    var style = {
      left: posPx.x,
      top: posPx.y,
      width: cfg.fontSize * 0.5,
      height: cfg.lineHeight,
      fontSize: cfg.fontSize,
      fontFamily: cfg.fontFamily,
      lineHeight: cfg.lineHeight + 'px'
    };

    return (
      <textarea className="cursor" style={style}
          ref={(ref) => this.textarea = ref }
          onKeyDown={this.handleKeyDown}
          onKeyPress={this.handleKeyPress}
          onKeyUp={this.handleKeyUp}>
      </textarea>
    );
  }

});

module.exports = Cursor;
