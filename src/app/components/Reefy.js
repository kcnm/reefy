var React = require('react');

var Editor = require('./Editor');


var Reefy = React.createClass({

  render: function() {
    return (
      <div className="reefy">
        <Editor />
      </div>
    );
  }

});

module.exports = Reefy;
