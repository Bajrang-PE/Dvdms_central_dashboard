import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ToastContainer } from 'react-toastify';
import "react-datepicker/dist/react-datepicker.css";
import Auth from './Auth';
import Loader from './modules/login-war/component/Loader';
import '../src/modules/login-war/LoginWar.css';
import ConfirmBoxLogin from './modules/login-war/component/ConfirmBoxLogin';
import LoginWarRoutes from './modules/login-war/LoginWarRoutes';

const NotFoundPage = lazy(() => import('./modules/login-war/pages/NotFound'));
const SessionExpired = lazy(() => import('./modules/login-war/pages/SessionExpired'));
const HomePage = lazy(() => import('./modules/login-war/pages/HomePage'));

function App() {

  return (
    <>
      {/* <Router> */}
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dvdms" element={<HomePage />} />
            <Route path="/dvdms/session-expired" element={<SessionExpired />} />
            <Route path="/dvdms/*" element={<Auth comp={LoginWarRoutes} />} />
            <Route path="*" element={<NotFoundPage />} />

            {/* <Route index element={<HomePage />} /> */}
          </Routes>
          <ToastContainer />
          <ConfirmBoxLogin />
        </Suspense>
      {/* </Router> */}
    </>
  )
}

export default App
