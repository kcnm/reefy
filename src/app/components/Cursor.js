var React = require('react');

var ConfigStore = require('../stores/ConfigStore');
var CursorStore = require('../stores/CursorStore');
var FileStore = require('../stores/FileStore');


var Cursor = React.createClass({

  getInitialState: function() {
    return {
      config: ConfigStore.getConfig(),
      position: CursorStore.getPosition()
    };
  },

  componentDidMount: function() {
    CursorStore.addPositionChangeListener(this._setPosition);
  },

  componentWillUnmount: function() {
    CursorStore.removePositionChangeListener(this._setPosition);
  },

  componentDidUpdate: function() {
    this.textarea.focus();
  },

  _setPosition: function() {
    this.setState({
      position: CursorStore.getPosition()
    });
  },

  render: function() {
    var cfg = this.state.config;
    var pos = FileStore.getCursorPxPosition(
        this.state.position.row,
        this.state.position.col);
    var style = {
      left: pos.x,
      top: pos.y,
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
