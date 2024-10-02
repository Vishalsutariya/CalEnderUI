// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './AuthContext';
import { ColorModeProvider } from './ColorModeContext';

ReactDOM.render(
  <AuthProvider>
    <ColorModeProvider>
      <App />
    </ColorModeProvider>
  </AuthProvider>,
  document.getElementById('root')
);
