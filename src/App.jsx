import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import HisRoutes from './modules/his-utils/HisRoutes';
import LoginWarRoutes from './modules/login-war/LoginWarRoutes';
import { ToastContainer } from 'react-toastify';
import ConfirmBox from './modules/his-utils/components/commons/ConfirmBox';
import Loader from './modules/his-utils/components/commons/Loader';
import ConfirmBoxLogin from './modules/login-war/component/ConfirmBoxLogin';
import "react-datepicker/dist/react-datepicker.css";

const HomePage = React.lazy(() => import('./modules/login-war/pages/HomePage'));

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/dvdms/HIS_dashboard/*" element={<HisRoutes />} />
          <Route path="/dvdms/*" element={<LoginWarRoutes />} />
          {/* <Route index element={<HomePage />} /> */}
          <Route path="/" element={<HomePage />} />
          <Route path="/dvdms" element={<HomePage />} />
          {/* <Route path index element={<NotFound />} /> */}

        </Routes>
        <ToastContainer />
        <ConfirmBox message={"Do you want to save this data?"} />
        <ConfirmBoxLogin />
        <Loader />
      </Router>
    </>
  )
}

export default App
