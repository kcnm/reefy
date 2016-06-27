var React = require('react');

var FileStore = require('../stores/FileStore');


var Cursor = React.createClass({

  componentDidUpdate: function() {
    this.textarea.focus();
  },

  render: function() {
    var cfg = this.props.config;
    var pos = this.props.position;
    var posPx = FileStore.getCursorPositionPx(pos.row, pos.col);
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
          ref={(ref) => this.textarea = ref }>
      </textarea>
    );
  }

});

module.exports = Cursor;
