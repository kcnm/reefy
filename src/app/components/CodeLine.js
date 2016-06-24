var React = require('react');

var ClickOnCodeLineAction = require('../actions/ClickOnCodeLineAction');


var CodeLine = React.createClass({

  handleClick: function(event) {
    event.stopPropagation();
    var e = event.nativeEvent;
    ClickOnCodeLineAction.create(e.offsetX, this.props.lineNum);
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
