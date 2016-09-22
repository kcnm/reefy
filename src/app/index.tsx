import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Reefy from './components/Reefy';

// Import CSS module.
import './stylesheet.css';

// Default input.
let config = {
  fontSize: 12,
  fontFamily: 'monospace',
  lineHeight: 14
};

// Renders reefy editor.
ReactDOM.render(
    <Reefy />,
    document.getElementById('reefy'));
