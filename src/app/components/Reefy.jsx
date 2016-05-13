var React = require('react');

var Editor = require('./Editor.jsx');

export var Reefy = React.createClass({
  render: function() {
    return (
      <div className="reefy">
        <Editor.Editor
            inlineStyle={this.props.inlineStyle}
            file={this.props.file} />
      </div>
    );
  }
});
