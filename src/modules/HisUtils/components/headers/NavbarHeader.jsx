import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import './NavbarHeader.css';
import { Link } from 'react-router-dom';
import { HISContext } from '../../contextApi/HISContext';
import { fetchPostData } from '../../utils/ApiHooks';

const NavbarHeader = () => {
    const { setActionMode, setSelectedOption } = useContext(HISContext)
    const dashboardMasterDt = [
        { label: 'Widget Master', link: "/hisUtils/widget-master" },
        { label: 'Tab Master', link: "/hisUtils/tab-master" },
        { label: 'Dashboard Master', link: "/hisUtils/dashboard-master" },
        { label: 'Parameter Master', link: "/hisUtils/parameter-master" },
        { label: 'Dashboard Configuration Master', link: "/hisUtils/dashboard-configuration-master" }
    ]
    const webServiceMaster = [
        { label: 'Data Service Master', link: "/hisUtils/data-service-master" },
        { label: 'Service User Master', link: "/hisUtils/service-user-master" },
        { label: 'Dashboard SubMenu Master', link: "/hisUtils/dashboard-submenu-master" }
    ]
    const reset = () => {
        localStorage.removeItem('values');
        localStorage.removeItem('radio');
        setSelectedOption([]);
        setActionMode('home')
    }

    const executeProcedure = async () => {
        const procedureName = 'pkg_central_dashboard.proc_state_excess_short_by_qty_tabular';

        const parameters = {
            p_hospitalcode: "998",
            p_userid: "10001",
            p_primarykey: "",
            p_strparaid: "3,22",
            p_strparavalue: "%,%",
            p_ispaginationreq: "Yes",
            p_initialrecordno: "1",
            p_finalrecordno: "5",
            p_dateoptions: "",
            p_fromvalue: "10-Mar-2025",
            p_tovalue: "10-Mar-2025"
        };

        const dataval = ['998','10001','','3,22','%,%','Yes','1','5','','10-Mar-2025','10-Mar-2025','','','','','']

        const response = await fetchPostData(`api/procedures/execute-function?functionName=${procedureName}`, dataval);
        // const data = await response.json();
        console.log(response, 'proresponse')
        return response;
    };

    const procall = () => {
        fetch("http://localhost:8024/api/procedures/executebg?procedureName=proc_state_excess_short_by_qty_tabular", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                p_hospitalcode: "998",
                p_userid: "10001",
                p_primarykey: "46",
                p_strparaid: "29,30,14",
                p_strparavalue: "%,%,%",
                p_ispaginationreq: "No",
                p_initialrecordno: "0",
                p_finalrecordno: "0",
                p_dateoptions: "",
                p_fromvalue: "07-Mar-2025",
                p_tovalue: "07-Mar-2025"
            })
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error("Error:", error));
    }



    return (
        <nav className="navbar navbar-expand-lg navbar-dark navbar-header-his">
            <div className="container-fluid his-brand">
                <a className="navbar-brand logo" href="/">HIS Utility</a>
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
                        {/* <li>
                            <button
                                className="nav-link dropdown-toggle dropdownAnchor"
                                role="button"
                                onClick={() => { executeProcedure() }}
                            >
                                Execute
                            </button>
                        </li> */}
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
    );
};

export default NavbarHeader;
