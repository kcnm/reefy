var React = require('react');

var CodeArea = require('./CodeArea');


var Editor = React.createClass({

  render: function() {
    return (
      <div className="editor">
        <CodeArea />
      </div>
    );
  }

});

module.exports = Editor;
