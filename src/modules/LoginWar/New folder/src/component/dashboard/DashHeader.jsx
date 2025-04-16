import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FeedbackForm from './FeedbackForm';
import { stateData } from '../../localData/HomeData';
import MenuList from './MenuList';

const DashHeader = () => {
    const [showFeedback, setShowFeedback] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const onClose = () => {
        setShowFeedback(false)
    }

    const handleDropdown = (id) => {
        setActiveDropdown((prev) => (prev === id ? null : id));
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown') && !event.target.closest('.mega-menu')) {
                setActiveDropdown(null);
            }
            if(event.target.closest('.acrmenu')){
                setActiveDropdown(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className='dashboard-header-nav'>
            <nav className="navbar navbar-expand-lg dash-header p-1">

                <a className='navbar-brand ps-4 py-0 text-white' href="/">
                    <div style={{ fontSize: "27px" }} className='fs-3 fs-md-2 fs-sm-5'>DVDMS CENTRAL DASHBOARD</div>
                    <div style={{ fontSize: "15px" }} className="fs-6 fs-md-5 fs-sm-6">Ministry of Health and Family Welfare (Govt. of India)</div>
                </a>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">

                        <li className="nav-item dropdown" onClick={() => handleDropdown('dropmenulinks')}>
                            <a className="nav-link text-white fs-15" href="#" id="menuDropdown" role="button" data-bs-toggle="dropdown">
                                <i className="fa fa-bars"></i> MENU
                            </a>
                        </li>

                        <li className="nav-item dropdown" onClick={() => handleDropdown('stateLinksDropdown')}>
                            <a className="nav-link text-white fs-15" href="#" id="stateLinks" role="button" data-bs-toggle="dropdown">
                                <i className="fa fa-external-link-alt"></i> STATE DVDMS LINKS
                            </a>
                        </li>

                        <li className="nav-item dropdown" onClick={() => setActiveDropdown(null)}>
                            <a className="nav-link text-white" href="#" id="profileDropdown" role="button" data-bs-toggle="dropdown">
                                <i className="fa fa-user-circle" style={{ fontSize: "large" }} ></i>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li className='dropdown-item text-center' style={{ textDecoration: "underline" }}> <b> Welcome User</b></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <Link className="dropdown-item" to="/dvdms-change-password">
                                        <i className="fa fa-lock me-2"></i>
                                        Change Password
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/dvdms-change-user">
                                        <i className="fa fa-edit me-2"></i>
                                        Change User Details
                                    </Link>
                                </li>
                                <li onClick={() => setShowFeedback(true)}>
                                    <a className="dropdown-item" href="#">
                                        <i className="fa fa-comment me-2"></i>
                                        Feedback
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#">
                                        <i className="fa fa-right-from-bracket me-2"></i>
                                        Sign Out
                                    </a>
                                </li>
                            </ul>
                        </li>

                    </ul>
                </div>
                <ul className={`dropdown-menu mega-menu ${activeDropdown === 'stateLinksDropdown' ? 'show' : ''}`} id='stateLinksDropdown'>
                    <div className='container'>
                        <div className='row'>
                            {stateData?.map((state, index) => (
                                <div className="col-lg-2 col-md-4 col-sm-4 col-12 menu-hov" key={index}>
                                    <a target="_blank" href={state?.link}>
                                        <img src={state?.imgUrl} className="img-fluid" alt={`${state?.stateName} image`} />
                                    </a>
                                    <a className="" target="_blank" href={state?.link}>
                                        <span><center>  {state?.stateName}</center></span>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </ul>
                <MenuList activeDropdown={activeDropdown} />
            </nav>
            {showFeedback &&
                <FeedbackForm onClose={onClose} />
            }
        </div>
    );
}

export default DashHeader;
