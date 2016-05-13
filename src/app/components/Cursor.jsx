var React = require('react');

export var Cursor = React.createClass({
  componentDidUpdate: function() {
    this.textarea.focus();
  },

  handleKeyDown: function(event) {
    console.log(event.key);
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

export var Direction = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right'
};
