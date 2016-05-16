var React = require('react');

export var Key = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  ENTER: 'Enter',
  BACKSPACE: 'Backspace',
  DELETE: 'Delete',
  SHIFT: 'Shift'
};

export var Cursor = React.createClass({
  componentDidUpdate: function() {
    this.textarea.focus();
  },

  handleKeyDown: function(event) {
    var key = event.key;
    switch (key) {
      case Key.UP:
      case Key.DOWN:
      case Key.LEFT:
      case Key.RIGHT:
      case Key.HOME:
      case Key.END:
        event.preventDefault();
        this.props.moveCursor(key);
        break;
      case Key.BACKSPACE:
      case Key.DELETE:
        this.props.remove(key);
        break;
      case Key.SHIFT:
        this.props.enterVisualMode();
        break;
    }
  },

  handleKeyPress: function(event) {
    event.preventDefault();
    this.props.insert(event.key);
  },

  handleKeyUp: function(event) {
    if (event.key == Key.SHIFT) {
      this.props.exitVisualMode();
    }
  },

  render: function() {
    var style = {
      left: this.props.position.x,
      top: this.props.position.y,
      width: this.props.config.fontSize * 0.5,
      height: this.props.config.lineHeight,
      fontSize: this.props.config.fontSize,
      fontFamily: this.props.config.fontFamily,
      lineHeight: this.props.config.lineHeight + 'px'
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
