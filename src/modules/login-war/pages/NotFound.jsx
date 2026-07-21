import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
    const handleGoBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = "/";
        }
    };
    return (
        <div className="d-flex align-items-center justify-content-center bg-light min-vh-100 px-4">
            <div className="text-center">
                <h1 className="display-1 fw-bold text-primary">404</h1>
                <h2 className="h3 fw-semibold text-dark mt-3">Page Not Found</h2>
                <p className="text-muted mt-2 mb-4">
                    Sorry, the page you're looking for doesn't exist or has been moved.
                </p>
                <button
                    type="button"
                    onClick={handleGoBack}
                    className="btn btn-primary btn-lg rounded-pill px-4"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;
