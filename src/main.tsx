import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { useParque } from './app/store';
import './styles/global.css';

// Só em desenvolvimento: permite que scripts de captura posicionem a câmera (docs/capturas/ilustracoes).
if (import.meta.env.DEV) (window as unknown as { __parque?: typeof useParque }).__parque = useParque;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
