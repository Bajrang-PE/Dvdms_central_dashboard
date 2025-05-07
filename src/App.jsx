import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import HisRoutes from './modules/HisUtils/HisRoutes';
import LoginWarRoutes from './modules/LoginWar/LoginWarRoutes';
import { ToastContainer } from 'react-toastify';
import ConfirmBox from './modules/HisUtils/components/commons/ConfirmBox';
import Loader from './modules/HisUtils/components/commons/Loader';
import HomePage from './modules/LoginWar/pages/HomePage';
import ConfirmBoxLogin from './modules/LoginWar/component/ConfirmBoxLogin';
import "react-datepicker/dist/react-datepicker.css";


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/dvdms/HIS_dashboard/*" element={<HisRoutes />} />
          <Route path="/dvdms/*" element={<LoginWarRoutes />} />
          <Route index element={<HomePage />} />
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
