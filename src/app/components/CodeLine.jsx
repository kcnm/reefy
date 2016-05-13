var React = require('react');

export var CodeLine = React.createClass({
  handleClick: function(event) {
    event.stopPropagation();
    var x = event.nativeEvent.offsetX;
    var c = 0;
    var pos = 0;
    var width = this.props.computeLineWidth(this.props.code);
    if (x > width) {
      c = this.props.code.length;
      pos = width;
    } else {
      var dist = x;
      var s = '';
      for (var i = 0; i < this.props.code.length; ++i) {
        s += this.props.code.charAt(i);
        var p = this.props.computeLineWidth(s);
        var d = Math.abs(x - p);
        if (d < dist) {
          dist = d;
          c = i;
          pos = p;
        }
      }
    }
    var r = this.props.lineNum;
    this.props.moveCursor(r, c, pos, this.props.lineHeight * r);
  },

  render: function() {
    return (
      <div className="code-line" onClick={this.handleClick}>
        <span>{this.props.code}</span>
      </div>
    );
  }
});
