import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Essencial para carregar o Tailwind CSS!
import App from './App';

// Procura a div com o id="root" no seu index.html
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// Renderiza a aplicação (o nosso porteiro App.js) dentro dessa div
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);