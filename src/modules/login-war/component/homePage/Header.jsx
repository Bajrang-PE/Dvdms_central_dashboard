import React, { useContext } from 'react'
import { LoginContext } from '../../context/LoginContext'

const Header = () => {
    const { setShowCmsLogin } = useContext(LoginContext);

    const onCmsLogin = () => {
        setShowCmsLogin(true);
    }

    const redirectUrl = (e) => {
        e.preventDefault();
        const redirectConfirm = window.confirm('You are redirecting to another website');
        if (redirectConfirm) {
            window.open(e.target.href, '_blank')
        }
    }

    return (
        <>
            <div className="row w-100 top-bar">
                <div className="col-12 m-1 pl-5 left-to-right">
                    <a className="top-header" href="https://www.india.gov.in" target="_blank">भारत सरकार | Government of India </a>
                </div>
            </div>

            <div className='container-fluid py-1 header-bar'>
                <div className="row">
                    <div className='col-md-3'>
                        <div className='logo d-flex align-items-center'>
                            <a className="pt-1" href="https://www.india.gov.in/" target="_blank" >
                                <img src="https://uatcdash.dcservices.in/HIS/hisglobal/CDBTemplate_V_3/Images/sher.png" className='logo-image' alt="logo" />
                            </a>
                            <div className="dvdms-outer">
                                <div className="dvdms-title ms-2 mt-1">
                                    <h5 className="text-white mb-0" style={{ fontSize: "larger" }}>CENTRAL MONITORING SYSTEM</h5>
                                    <p className="text-white mb-0" style={{ fontSize: "13px" }}>Ministry of Health &amp; Family Welfare<br /> (Govt. of India)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-8 d-block d-xl-flex align-items-center justify-content-center p-lg-0 p-1">
                        <nav className="navbar navbar-expand-lg navbar-dark navbar-header pt-1 pb-0 me-0 me-xl-3">
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
                                <div className="navbar-nav nav ms-auto">
                                    <a className="nav-link fs-6 text-white" href="#graphs" id="dropdownMenu2" role="button">Graphs</a>
                                    <a className="nav-link fs-6 text-white" href="#functionalities" id="dropdownMenu2" role="button">Functionality</a>
                                    <a className="nav-link fs-6 text-white" href="#features" id="dropdownMenu2" role="button">Features</a>
                                    <a className="nav-link fs-6 text-white" href="#state" id="dropdownMenu2" role="button">State/UT DVDMS</a>
                                </div>
                            </div>
                        </nav>

                        <div className="buttons d-block d-md-flex align-items-center">

                            <a className="btn header-image me-lg-2 me-1" onClick={() => onCmsLogin()}>CMS Login</a>
                            <a className="btn header-image  me-lg-2 me-1" href='bajrangi.com' target='_blank' onClick={(e) => { redirectUrl(e) }}>Access through Parichay</a>
                            <a className="btn header-image me-lg-2 me-1" href='https://dvdmsgen.prd.dcservices.in/IMCS/login' target='_blank' onClick={(e) => { redirectUrl(e) }}>Generalized DVDMS Login</a>

                        </div>
                    </div>
                    <div className='col-md-1'>
                        <img src="https://uatcdash.dcservices.in/HIS/hisglobal/CDBTemplate_V_3/Images/nlm5.png" alt="logo" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header
