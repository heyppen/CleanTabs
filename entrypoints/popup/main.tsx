import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.tsx';
import './style.css';
import { Provider } from '@/components/providers.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>,
);
