var React = require('react');

export var CodeLine = React.createClass({
  handleClick: function(event) {
    event.stopPropagation();
    var x = event.nativeEvent.offsetX;
    var col = 0;
    var width = this.props.computeLineWidth(this.props.code);
    if (x > width) {
      col = this.props.code.length;
    } else {
      var minDist = x;
      for (var i = 1; i <= this.props.code.length; ++i) {
        var p = this.props.computeLineWidth(this.props.code.slice(0, i));
        var d = Math.abs(x - p);
        if (d < minDist) {
          minDist = d;
          col = i;
        }
      }
    }
    this.props.moveCursorTo(this.props.lineNum, col);
  },

  render: function() {
    return (
      <div className="code-line" onClick={this.handleClick}>
        <span>{this.props.code}</span>
      </div>
    );
  }
});
