import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import LoginWarRoutes from './modules/login-war/LoginWarRoutes';
import { ToastContainer } from 'react-toastify';
import ConfirmBoxLogin from './modules/login-war/component/ConfirmBoxLogin';
import "react-datepicker/dist/react-datepicker.css";
import Auth from './Auth';
import NotFoundPage from './modules/login-war/pages/NotFound';
import SessionExpired from './modules/login-war/pages/SessionExpired';

const HomePage = React.lazy(() => import('./modules/login-war/pages/HomePage'));

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/dvdms/*" element={<Auth comp={LoginWarRoutes} />} />
          {/* <Route index element={<HomePage />} /> */}
          <Route path="/" element={<HomePage />} />
          <Route path="/dvdms" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/dvdms/session-expired" element={<SessionExpired />} />

        </Routes>
        <ToastContainer />
        <ConfirmBoxLogin />
      </Router>
    </>
  )
}

export default App
