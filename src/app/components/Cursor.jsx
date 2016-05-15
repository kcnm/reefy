var React = require('react');

export var Direction = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight'
};

export var Cursor = React.createClass({
  componentDidUpdate: function() {
    this.textarea.focus();
  },

  handleKeyDown: function(event) {
    var key = event.key;
    console.log(key);
    switch (key) {
      case Direction.UP:
      case Direction.DOWN:
      case Direction.LEFT:
      case Direction.RIGHT:
        this.props.moveCursor(key);
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
