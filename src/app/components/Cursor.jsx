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
  DELETE: 'Delete'
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
    }
  },

  handleKeyPress: function(event) {
    event.preventDefault();
    this.props.insert(event.key);
  },

  handleKeyUp: function(event) {
  },

  render: function() {
    var style = {
      left: this.props.position.x,
      top: this.props.position.y,
      width: this.props.inlineStyle.fontSize * 0.5,
      height: this.props.inlineStyle.lineHeight,
      fontSize: this.props.inlineStyle.fontSize,
      fontFamily: this.props.inlineStyle.fontFamily,
      lineHeight: this.props.inlineStyle.lineHeight + 'px'
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
