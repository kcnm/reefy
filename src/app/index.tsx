import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Reefy from './components/Reefy';

// Import CSS module.
import './stylesheet.css';


// Renders reefy editor.
ReactDOM.render(
    <Reefy />,
    document.getElementById('reefy'));
