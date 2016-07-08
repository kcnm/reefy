var React = require('react');


var CodeLine = React.createClass({

  handleClick: function(event) {
    this.props.handlers.handleClick(event, this.props.lineNum);
  },

  render: function() {
    var style = {};
    if (!this.props.code) {
      style = {
        display: 'block',
        height: this.props.config.lineHeight
      };
    }

    return (
      <div className="code-line"
          onClick={this.handleClick}>
        <span style={style}>
          {this.props.code}
        </span>
      </div>
    );
  }

});

module.exports = CodeLine;
