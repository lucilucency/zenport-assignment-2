import React from 'react';
import { render, hydrate } from 'react-dom';
import { Provider } from 'react-redux'
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import store from './store';

const rootElement = document.getElementById('root');
const app = (
  <Provider store={store}>
    <App/>
  </Provider>);

if (rootElement.hasChildNodes()) {
  render(app, rootElement);
} else {
  hydrate(app, rootElement);
}
registerServiceWorker();
