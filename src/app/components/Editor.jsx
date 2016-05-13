var React = require('react');

var CodeArea = require('./CodeArea.jsx');

export var Editor = React.createClass({
  render: function() {
    return (
      <div className="editor">
        <CodeArea.CodeArea
            inlineStyle={this.props.inlineStyle}
            code={this.props.file} />
      </div>
    );
  }
});
