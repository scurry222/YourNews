import React from 'react';
import { render } from 'react-dom';
import Scrollbar from 'smooth-scrollbar';

import App from './components/App.jsx';

Scrollbar.init(document.querySelector('#data-scrollbar'));

render(<App />, document.getElementById('app'));
