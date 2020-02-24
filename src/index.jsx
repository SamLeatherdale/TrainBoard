import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import "./scss/index.scss";
import AppIcon from "./components/AppIcon";

const root = document.getElementById('root');
if (window.location.href.includes('?icon')) {
    ReactDOM.render(<AppIcon/>, root);
} else {
    ReactDOM.render(<App />, root);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
