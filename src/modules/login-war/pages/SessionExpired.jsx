import React from "react";
import Modal from 'react-bootstrap/Modal';

const SessionExpired = () => {
  return (
    <Modal show={true} centered className="input-box" keyboard={false}>
      <Modal.Body className="p-0">
          <div className="card shadow p-4 text-center">
            <h3 className="text-danger mb-3">⚠ Session Expired</h3>
            <p className="text-danger">
              Your session has expired. Please log in again to continue.
            </p>
            <a href="/dvdms/" className="btn btn-warning mt-3">
              Login
            </a>
          </div>
      </Modal.Body>
    </Modal>
  );
};

export default SessionExpired;
