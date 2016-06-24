var React = require('react');

var ConfigStore = require('../stores/ConfigStore');
var FileStore = require('../stores/FileStore');

var ClickOnCodeAreaAction = require('../actions/ClickOnCodeAreaAction');

var CodeLine = require('./CodeLine');
var Cursor = require('./Cursor');


var CodeArea = React.createClass({

  getInitialState: function() {
    return {
      config: ConfigStore.getConfig(),
      lines: FileStore.getLines()
    };
  },

  handleClick: function(event) {
    event.stopPropagation();
    var e = event.nativeEvent;
    ClickOnCodeAreaAction.create(e.offsetX, e.offsetY);
  },

  render: function() {
    var cfg = this.state.config;
    var style = {
      fontSize: cfg.fontSize,
      fontFamily: cfg.fontFamily,
      lineHeight: cfg.lineHeight + 'px'
    };

    var codeLines = this.state.lines.map(function(line, idx) {
      return (
        <CodeLine key={idx}
            lineNum={idx}
            code={line} />
      );
    });

    return (
      <div className="code-area" style={style}
          onClick={this.handleClick}>
        <Cursor />
        {codeLines}
      </div>
    );
  }

});

module.exports = CodeArea;
