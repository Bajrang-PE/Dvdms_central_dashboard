import React, { useContext, useState, useEffect } from 'react';
import { LoginContext } from '../../context/LoginContext';
import StateUts from './StateUts';
import "./Header.css";

// SLIDER IMAGES ARRAY
const BASE_ROUTE = window.location.pathname.startsWith('/dvdms') ? '/dvdms' : '';
const SLIDE_IMAGES = [
    `${window.location.origin}${BASE_ROUTE}/drug2.png`,
    `${window.location.origin}${BASE_ROUTE}/bg.jpg`,
    `${window.location.origin}${BASE_ROUTE}/drug1.png`
];

const Header = () => {
    const { setShowCmsLogin } = useContext(LoginContext);
    const [showHeader, setShowHeader] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Custom Actions States
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const onCmsLogin = () => {
        setShowCmsLogin(true);
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const redirectUrl = (e) => {
        e.preventDefault();
        const redirectConfirm = window.confirm('You are redirecting to another website');
        if (redirectConfirm) {
            window.open(e.currentTarget.href, '_blank')
        }
    }

    useEffect(() => {
        const slideTimer = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % SLIDE_IMAGES.length);
        }, 4000);

        return () => clearInterval(slideTimer);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (e.clientY <= 45) {
                setShowHeader(true);
            } else if (window.scrollY <= 15 && e.clientY > 85) {
                setShowHeader(false);
            }
        };

        const handleScroll = () => {
            if (window.scrollY > 15) {
                setShowHeader(true);
            } else {
                setShowHeader(false);
            }
        };

        const handleClickOutside = (e) => {
            if (isMenuOpen &&
                !e.target.closest('.custom-side-drawer') &&
                !e.target.closest('.menu-hamburger')) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('click', handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <>
            <div className="portal-page-wrapper">

                <div
                    className="blurred-bg-image-layer"
                    style={{
                        backgroundImage: `url(${SLIDE_IMAGES[currentSlide]})`
                    }}
                ></div>

                <div className="color-tint-overlay"></div>

                {/* SOLID PURE WHITE HEADER WITH CLEAN THIN BORDER */}
                <div
                    className='container-fluid header-bar dynamic-reveal-header'
                    style={{
                        ...customStyles.headerBar,
                        transform: showHeader ? 'translateY(0)' : 'translateY(-100%)',
                        opacity: showHeader ? 1 : 0,
                        backgroundColor: '#ffffff',
                        color: '#222222'
                    }}
                >
                    <div className="row align-items-center w-100 m-0 py-1">

                        {/* LEFT SIDE: LOGO */}
                        <div className='col-md-4 py-0'>
                            <div className='logo d-flex align-items-center'>
                                <a className="d-flex align-items-center" href="https://www.india.gov.in/" target="_blank" rel="noreferrer">
                                    <img src="images.png" className='logo-image' alt="logo" style={{ height: '50px', width: 'auto' }} />
                                </a>
                                <div className="dvdms-outer">
                                    <div className="dvdms-title ms-3" style={{ lineHeight: '1.2' }}>
                                        <div style={{ display: 'block', paddingBottom: '1px' }}>
                                            <a className="top-header-link high-attention-motion-link" href="https://www.india.gov.in" target="_blank" rel="noreferrer"
                                                style={customStyles.topHeader}
                                            >
                                                <span className="live-dot-indicator"></span>
                                                Government of India
                                            </a>
                                        </div>
                                        <h5 className="stylish-gradient-title" style={customStyles.mainTitle}>
                                            CENTRAL MONITORING SYSTEM
                                        </h5>
                                        <p style={{ ...customStyles.subTitle, color: '#4a5568' }}>
                                            Ministry of Health &amp; Family Welfare (Govt. of India)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CENTER/RIGHT: NAVIGATION LINKS */}
                        <div className="col-md-7 d-block d-xl-flex align-items-center justify-content-end p-lg-0 py-0">
                            <nav className="navbar navbar-expand-lg navbar-light navbar-header pt-0 pb-0 me-0 me-xl-3">
                                <button
                                    className="navbar-toggler"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#navbarNavDropdown"
                                    aria-controls="navbarNavDropdown"
                                    aria-expanded="false"
                                    aria-label="Toggle navigation"
                                    style={{ padding: '2px 5px' }}
                                >
                                    <span className="navbar-toggler-icon" style={{ width: '18px', height: '18px' }}></span>
                                </button>

                                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                                    <div className="navbar-nav nav ms-auto" style={customStyles.navLinksContainer}>
                                        <a className="nav-link px-3 py-1" href="#graphs" style={{ ...customStyles.navLink, color: '#002147' }}>
                                            GRAPHS
                                        </a>
                                        <a className="nav-link px-3 py-1" href="#functionalities" style={{ ...customStyles.navLink, color: '#002147' }}>
                                            FUNCTIONALITY
                                        </a>
                                        <a className="nav-link px-3 py-1" href="#features" style={{ ...customStyles.navLink, color: '#002147' }}>
                                            FEATURES
                                        </a>
                                        <a className="nav-link px-3 py-1" href="#state" style={{ ...customStyles.navLink, color: '#002147' }}>
                                            STATES/UT DVDMS
                                        </a>
                                    </div>
                                </div>
                            </nav>

                            {/* BUTTONS */}
                            <div className="buttons d-block d-md-flex align-items-center gap-2 py-0">
                                <a className="btn custom-header-btn d-inline-flex align-items-center gap-1" onClick={() => onCmsLogin()} style={customStyles.primaryBtn}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                    CMS Login
                                </a>

                                <a className="btn custom-header-btn d-inline-flex align-items-center gap-1" href='#' target='_blank' onClick={(e) => { redirectUrl(e) }}
                                    style={{
                                        ...customStyles.secondaryBtn,
                                        backgroundColor: '#ffffff',
                                        color: '#0056b3',
                                        borderColor: '#0056b3'
                                    }}
                                >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                    Access through Parichay
                                </a>

                                <a className="btn custom-header-btn d-inline-flex align-items-center gap-1" href='https://dvdmsgen.prd.dcservices.in/IMCS/login' target='_blank' onClick={(e) => { redirectUrl(e) }}
                                    style={{
                                        ...customStyles.secondaryBtn,
                                        backgroundColor: '#ffffff',
                                        color: '#0d9488',
                                        borderColor: '#0d9488'
                                    }}
                                >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                                    Generalized DVDMS Login
                                </a>
                            </div>
                        </div>

                        {/* RIGHT SIDE NHM LOGO */}
                        <div className='col-md-1 text-end d-flex align-items-center justify-content-end py-0'>
                            <img src="nhmlogo.png" alt="logo" style={{ height: '50px', width: 'auto' }} />
                        </div>
                    </div>
                </div>

                {/* HERO BODY AREA */}
                <div className="main-portal-body" style={{ paddingTop: '20px' }}>

                    {/* FLOATING ACTIONS PANEL */}
                    <div className="floating-top-actions">
                        <a className="action-pill-btn parichay-blue" href='#' target='_blank' onClick={(e) => { redirectUrl(e) }} title="Access through Parichay">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            <span className="btn-label-text">Access through Parichay</span>
                        </a>

                        <a className="action-pill-btn dvdms-teal" href='https://dvdmsgen.prd.dcservices.in/IMCS/login' target='_blank' onClick={(e) => { redirectUrl(e) }} title="Generalized DVDMS Login">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                            <span className="btn-label-text">Generalized DVDMS Login</span>
                        </a>

                        <button className="action-pill-btn login-navy" onClick={onCmsLogin} title="CMS Login">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            <span className="btn-label-text">CMS Login</span>
                        </button>

                        <button className={`menu-hamburger ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} title="Toggle Navigation Menu">
                            <span className="bar"></span>
                            <span className="bar"></span>
                            <span className="bar"></span>
                        </button>
                    </div>

                    {/* DYNAMIC SIDE-DRAWER OVERLAY */}
                    <div className={`custom-side-drawer ${isMenuOpen ? 'drawer-active' : ''}`}>
                        <div className="drawer-header">
                            <h5>Navigation Menu</h5>
                            <button className="close-drawer-btn" onClick={toggleMenu}>&times;</button>
                        </div>
                        <div className="drawer-body">
                            <a href="#graphs" onClick={toggleMenu} className="drawer-nav-item">GRAPHS</a>
                            <a href="#functionalities" onClick={toggleMenu} className="drawer-nav-item">FUNCTIONALITY</a>
                            <a href="#features" onClick={toggleMenu} className="drawer-nav-item">FEATURES</a>
                            <a href="#state" onClick={toggleMenu} className="drawer-nav-item">STATES/UT DVDMS</a>
                        </div>
                    </div>

                    {/* HERO CONTAINER WITH ROYAL TYPOGRAPHY AND PRESERVED STRUCTURE */}
                    <div className="image-hero-container" style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        minHeight: '440px',
                        padding: '30px 20px',
                        overflow: 'hidden',
                        background: 'radial-gradient(circle, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.65) 100%)'
                    }}>

                        {/* ASHOK EMBLEM */}
                        <div style={{ zIndex: 2, marginBottom: '15px' }}>
                            <img
                                src="ChatGPT Image Jun 19, 2026, 10_55_32 AM.png"
                                alt="Ashok Emblem"
                                style={{
                                    height: '110px',
                                    width: 'auto',
                                    filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.75))'
                                }}
                            />
                        </div>

                        {/* TEXT CONTENT */}
                        <div style={{
                            zIndex: 2,
                            maxWidth: '850px',
                            margin: '0 auto'
                        }}>
                            <div style={{
                                fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
                                fontWeight: '700',
                                fontSize: '16px',
                                letterSpacing: '2.5px',
                                textTransform: 'uppercase',
                                color: '#FF9933',
                                marginBottom: '6px',
                                textShadow: '0px 2px 5px rgba(0,0,0,0.95)'
                            }}>
                                Government of India
                            </div>

                            <h1 style={{
                                fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
                                fontWeight: '900',
                                fontSize: '44px',
                                margin: '0',
                                letterSpacing: '1.5px',
                                lineHeight: '1.2',
                                color: '#FCD34D',
                                textShadow: '0px 3px 12px rgba(0, 0, 0, 0.95)'
                            }}>
                                CENTRAL MONITORING SYSTEM
                            </h1>

                            <div style={{
                                fontFamily: 'system-ui, -apple-system, sans-serif',
                                fontWeight: '600',
                                fontSize: '18px',
                                letterSpacing: '0.5px',
                                marginTop: '10px',
                                color: '#F8FAFC',
                                textShadow: '0px 2px 6px rgba(0,0,0,0.9)'
                            }}>
                                Ministry of Health &amp; Family Welfare
                            </div>

                            <p style={{
                                fontFamily: 'system-ui, -apple-system, sans-serif',
                                marginTop: '18px',
                                fontSize: '14.5px',
                                color: '#E2E8F0',
                                fontWeight: '400',
                                lineHeight: '1.65',
                                textShadow: '0px 2px 6px rgba(0,0,0,0.95)',
                                marginBottom: '25px'
                            }}>
                                Ensuring last-mile healthcare predictability through seamless digital synchronization, robust supply transparency, and data-driven administrative monitoring mechanisms across all States and Union Territories.
                            </p>
                        </div>

                    </div>

                    {/* TARGET PLACEMENT LOWER ON BG LAYER */}
                    <div className="header-bg-overlay-states-ribbon">
                        <StateUts />
                    </div>
                </div>

            </div>
        </>
    )
}

export default Header;

const customStyles = {
    headerBar: {
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        paddingTop: '3px',
        paddingBottom: '5px',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease-in-out'
    },
    topHeader: {
        fontSize: '11px',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: '0.4px'
    },
    mainTitle: {
        fontWeight: '800',
        letterSpacing: '0.2px',
        fontSize: '15.5px',
        margin: 0
    },
    subTitle: {
        fontSize: '10px',
        fontWeight: '600',
        letterSpacing: '0.1px',
        marginTop: '1px',
        margin: 0
    },
    navLinksContainer: {
        gap: '5px',
        display: 'flex',
        alignItems: 'center'
    },
    navLink: {
        fontSize: '11px',
        fontWeight: '600',
        letterSpacing: '0.1px',
        lineHeight: '24px',
        textAlign: 'center'
    },
    primaryBtn: {
        backgroundColor: '#0056b3',
        color: '#ffffff',
        fontWeight: '600',
        fontSize: '12.5px',
        padding: '6px 14px',
        borderRadius: '4px',
        border: '1px solid #004085',
        cursor: 'pointer'
    },
    secondaryBtn: {
        fontWeight: '600',
        fontSize: '12.5px',
        padding: '6px 14px',
        borderRadius: '4px',
        border: '1px solid',
        cursor: 'pointer'
    }
};