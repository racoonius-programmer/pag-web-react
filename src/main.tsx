import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Import de css
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css'; 

// Las librerias de bootstrap
// @ts-ignore
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
(window as any).bootstrap = bootstrap;


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)