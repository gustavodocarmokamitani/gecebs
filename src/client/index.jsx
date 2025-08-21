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
import Athlete from './pages/Athlete.jsx';
import AthleteForm from './pages/AthleteForm.jsx';
import Payment from './pages/Payment.jsx';
import PaymentForm from './pages/PaymentForm.jsx';
import Event from './pages/Event.jsx';
import EventForm from './pages/EventForm.jsx';
import Settings from './pages/Settings.jsx';
import MainLayout from './components/MainLayout.jsx';
import Analytics from './pages/Analytics.jsx';

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
              <Route path="/" element={<MainLayout />}>
                {/* Rota padrão aninhada (index) para a rota pai "/" */}
                <Route path="analytics" element={<Analytics />} />
                <Route path="athlete" element={<Athlete />} />{' '}
                <Route path="athlete/new" element={<AthleteForm />} />{' '}
                <Route path="athlete/edit/:athleteId" element={<AthleteForm />} />{' '}
                <Route path="payment" element={<Payment />} />
                <Route path="payment/new" element={<PaymentForm />} />{' '}
                <Route path="payment/edit/:paymentId" element={<PaymentForm />} />{' '}
                <Route path="event" element={<Event />} />
                <Route path="event/new" element={<EventForm />} />{' '}
                <Route path="event/edit/:eventId" element={<EventForm />} />{' '}
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}
