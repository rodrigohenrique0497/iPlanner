
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// O registro é gerenciado pelo VitePWA através do injectRegister: 'auto' no vite.config.ts
// mas manter este bloco garante que o SW seja registrado mesmo se a injeção automática falhar.
// Fix: Use type assertion to any for import.meta to avoid TS error in index.tsx

if ('serviceWorker' in navigator && (import.meta as any).env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(reg => console.log('iPlanner SW ativo:', reg.scope))
      .catch(err => console.error('Erro SW:', err));
  });
}