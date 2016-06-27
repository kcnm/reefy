var React = require('react');


var CodeLine = React.createClass({

  handleClick: function(event) {
    this.props.handlers.handleClick(event, this.props.lineNum);
  },

  render: function() {
    return (
      <div className="code-line"
          onClick={this.handleClick}>
        <span>
          {this.props.code}
        </span>
      </div>
    );
  }

});

module.exports = CodeLine;
