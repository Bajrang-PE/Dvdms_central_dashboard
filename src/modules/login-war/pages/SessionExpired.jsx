import React from "react";

const SessionExpired = () => {


  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4 text-center" style={{ maxWidth: "400px" }}>
        <h3 className="text-danger mb-3">⚠ Session Expired</h3>
        <p className="text-danger">
          Your session has expired. Please log in again to continue.
        </p>
        <a href="/dvdms/" className="btn btn-warning mt-3">
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default SessionExpired;
