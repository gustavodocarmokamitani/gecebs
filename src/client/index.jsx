import React from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme.ts';

import './app.css';
import { AuthProvider } from './hooks/useAuth.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

const root = document.getElementById('root');
if (root !== null) {
  const appRoot = createRoot(root);
  appRoot.render(
    <React.Fragment>
      <ToastContainer position="bottom-right" theme="dark" />
      <ThemeProvider theme={theme}>
        {/* Envolva a aplicação com o AuthProvider */}
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Rota pública */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Rota privada */}
              {/* <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                 
                  </PrivateRoute>
                }
              /> */}
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}
