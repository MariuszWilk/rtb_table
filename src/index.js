import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import getData from './mockGetData';

ReactDOM.render(<App getData={getData} />, document.getElementById('root'));
registerServiceWorker();
