import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import './NavbarHeader.css';
import { Link } from 'react-router-dom';
import { HISContext } from '../../contextApi/HISContext';

const NavbarHeader = () => {
    const { setActionMode, setSelectedOption } = useContext(HISContext)
    const dashboardMasterDt = [
        { label: 'Widget Master', link: "/dvdms/HIS_dashboard/widget-master" },
        { label: 'Tab Master', link: "/dvdms/HIS_dashboard/tab-master" },
        { label: 'Dashboard Master', link: "/dvdms/HIS_dashboard/dashboard-master" },
        { label: 'Parameter Master', link: "/dvdms/HIS_dashboard/parameter-master" },
        { label: 'Dashboard Configuration Master', link: "/dvdms/HIS_dashboard/dashboard-configuration-master" }
    ]
    const webServiceMaster = [
        { label: 'Data Service Master', link: "/dvdms/HIS_dashboard/data-service-master" },
        { label: 'Service User Master', link: "/dvdms/HIS_dashboard/service-user-master" },
        { label: 'Dashboard SubMenu Master', link: "/dvdms/HIS_dashboard/dashboard-submenu-master" }
    ]
    const reset = () => {
        localStorage.removeItem('values');
        localStorage.removeItem('radio');
        setSelectedOption([]);
        setActionMode('home')
    }

    return (
        <>
        {/* <DashHeader/> */}
        <nav className="navbar navbar-expand-lg navbar-dark navbar-header-his">
            <div className="container-fluid his-brand">
                <a className="navbar-brand logo" href="/dvdms/user-dashboard">HIS Utility</a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav ms-auto">
                       
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle dropdownAnchor"
                                href="#"
                                id="dropdownMenu1"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Dashboard Masters
                            </a>
                            <ul className="dropdown-menu drpb-menu" aria-labelledby="dropdownMenu1">
                                {dashboardMasterDt.map((item, index) => (
                                    <li key={index} className="dropdown-list">
                                        <Link className="dropdown-item" to={item?.link} onClick={() => reset()}>
                                            <FontAwesomeIcon icon={faGear} className="me-2 dropdown-gear-icon" />
                                            {item?.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle dropdownAnchor"
                                href="#"
                                id="dropdownMenu2"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Web Service Masters
                            </a>
                            <ul className="dropdown-menu drpb-menu" aria-labelledby="dropdownMenu2" style={{ right: 0, left: "auto" }}>
                                {webServiceMaster.map((item, index) => (
                                    <li key={index} className="dropdown-list">
                                        <Link className="dropdown-item" to={item?.link} onClick={() => reset()}>
                                            <FontAwesomeIcon icon={faGear} className="me-2 dropdown-gear-icon" />
                                            {item?.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        </>
    );
};

export default NavbarHeader;
