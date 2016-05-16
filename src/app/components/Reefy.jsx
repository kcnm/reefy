var React = require('react');

var Editor = require('./Editor.jsx');

export var Reefy = React.createClass({
  render: function() {
    return (
      <div className="reefy">
        <Editor.Editor
            config={this.props.config}
            file={this.props.file} />
      </div>
    );
  }
});
