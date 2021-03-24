import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import App from './App';
import { EthersProvider } from './lib';

ReactDOM.render(
  <React.StrictMode>
    <EthersProvider>
      <App />
    </EthersProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
