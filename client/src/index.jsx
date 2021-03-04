import React from 'react';
import { render } from 'react-dom';

import Globe from './components/Globe.jsx';
import App from './components/App.jsx';


render(<App />, document.getElementById('newslist'));

render(<Globe />, document.getElementById('globe'));
