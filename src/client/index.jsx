import React from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme.ts';

import './app.css';
import PrivateRoute from './components/PrivateRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Athlete from './pages/Athlete.jsx';
import AthleteForm from './pages/AthleteForm.jsx';
import Manager from './pages/Manager.jsx';
import ManagerForm from './pages/ManagerForm.jsx';
import Payment from './pages/Payment.jsx';
import PaymentForm from './pages/PaymentForm.jsx';
import PaymentItemForm from './pages/PaymentItemForm.jsx';
import Event from './pages/Event.jsx';
import EventForm from './pages/EventForm.jsx';
import Settings from './pages/Settings.jsx';
import MainLayout from './components/MainLayout.jsx';
import Analytics from './pages/Analytics.jsx';
import { AuthProvider } from './hooks/AuthContext';

const root = document.getElementById('root');
if (root !== null) {
  const appRoot = createRoot(root);
  appRoot.render(
    <React.Fragment>
      {/* ... */}
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Container de rotas privadas */}
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Analytics />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="athlete" element={<Athlete />} />
                  <Route path="athlete/new" element={<AthleteForm />} />
                  <Route path="athlete/edit/:athleteId" element={<AthleteForm />} />
                  <Route path="manager" element={<Manager />} />
                  <Route path="manager/new" element={<ManagerForm />} />
                  <Route path="manager/edit/:managerId" element={<ManagerForm />} />
                  <Route path="payment" element={<Payment />} />
                  <Route path="payment/new" element={<PaymentForm />} />
                  <Route path="payment/edit/:paymentId" element={<PaymentForm />} />
                  <Route path="/payment/items/:paymentId" element={<PaymentItemForm />} />
                  <Route path="event" element={<Event />} />
                  <Route path="event/new" element={<EventForm />} />
                  <Route path="event/edit/:eventId" element={<EventForm />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </React.Fragment>
  );
}
