var React = require('react');
var ReactDOM = require('react-dom');

var Reefy = require('./components/Reefy.jsx');

// Import CSS module.
require('./stylesheet.css');

// Default input.
var config = {
  fontSize: 12,
  fontFamily: 'monospace',
  lineHeight: 14
};
var file = 'hello\nworld\n';

// Renders reefy editor.
ReactDOM.render(
    <Reefy.Reefy config={config} file={file}/>,
    document.getElementById('reefy'));
