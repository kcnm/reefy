var React = require('react');

var CursorStore = require('../stores/CursorStore');


var CodeLine = React.createClass({

  handleClick: function(event) {
    this.props.handlers.handleClick(event, this.props.lineNum);
  },

  _intersect: function(pos) {
    if (pos.row < this.props.lineNum) {
      return 0;
    } else if (pos.row > this.props.lineNum) {
      return this.props.code.length;
    }
    return pos.col;
  },

  render: function() {
    var style = {};
    if (!this.props.code) {
      style = {
        display: 'block',
        height: this.props.config.lineHeight
      };
    }

    var content = <span style={style}>{this.props.code}</span>;

    var sel = this.props.selection;
    if (sel) {
      var prolog = this._intersect(sel.begin);
      var epilog = this._intersect(sel.end);
      if (prolog < epilog) {
        content = [
          <span key="prolog" style={style}>
            {this.props.code.slice(0, prolog)}
          </span>,
            <span key="select" className="highlight" style={style}>
            {this.props.code.slice(prolog, epilog)}
          </span>,
          <span key="epilog" style={style}>
            {this.props.code.slice(epilog)}
          </span>
        ];
      }
    }

    return (
      <div className="code-line"
          onClick={this.handleClick}>
        {content}
      </div>
    );
  }

});

module.exports = CodeLine;
