import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../index.css';
import ABNTify from './index.jsx';
import Historico from './historico.jsx';
import '../historico.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ABNTify />} />
        <Route path="/historico" element={<Historico />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);