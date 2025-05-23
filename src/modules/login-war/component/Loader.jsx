import React from 'react';

const Loader = () => {
    return (
        <div className="fade modal-backdrop show d-flex justify-content-center align-items-center">
            <div className="spinner-grow" role="status" style={{ height: "3rem", width: "3rem", color: "#ff7902" }}>
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};

export default Loader;
