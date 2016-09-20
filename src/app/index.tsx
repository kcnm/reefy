import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Reefy } from './components/Reefy';

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
    <Reefy />,
    document.getElementById('reefy'));
