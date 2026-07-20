import React, { useContext, useEffect, useState } from 'react'
import Header from '../component/homePage/Header'
import HomeSlider from '../component/homePage/HomeSlider'
import Facilities from '../component/homePage/Facilities'
import Functionalities from '../component/homePage/Functionalities'
import Features from '../component/homePage/Features'
import Footer from '../component/homePage/Footer'
import CmsLogin from '../component/homePage/CmsLogin'
import { LoginContext } from '../context/LoginContext'
import "./HomePage.css";
import ForgotPassForm from '../component/homePage/ForgotPassForm'
import { useAccessibility } from '../hooks/useAccessibility'
import AccessibilityWidget from "../component/homePage/AccessibilityWidget";
import NotificationTicker from '../component/homePage/NotificationTicker'
import CalendarModal from '../component/homePage/CalendarModal';

const HomePage = () => {
    const { showCmsLogin, setShowCmsLogin, showForgotPass, setShowForgotPass } = useContext(LoginContext);
    const [showMoveToTop, setShowMoveToTop] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showLangMenu, setShowLangMenu] = useState(false);

    useEffect(() => {
        loadGoogleTranslate();

        const handleScroll = () => {
            if (window.scrollY > 100) {
                setShowMoveToTop(true);
            } else {
                setShowMoveToTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    useEffect(() => {
        const handleClickOutside = (e) => {
            const wrapper = document.querySelector('.translate-shortcut-wrapper');
            if (wrapper && !wrapper.contains(e.target)) {
                setShowLangMenu(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);


    const handleScrollToTop = (e) => {
        if (e) e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const onCloseModal = () => {
        setShowCmsLogin(false);
        setShowForgotPass(false);
    }

    const onCloseForgotModal = () => {
        setShowForgotPass(false);
    }

    const changeLanguage = (lang) => {
        const applyLanguage = () => {
            const select = document.querySelector('.goog-te-combo');

            if (select) {
                select.value = lang;
                select.dispatchEvent(new Event('change'));
                setShowLangMenu(false);
                return true;
            }
            return false;
        };

        let count = 0;
        const timer = setInterval(() => {
            count++;
            if (applyLanguage() || count > 20) {
                clearInterval(timer);
                if (count > 20) {
                    console.warn("Translate not ready");
                }
            }
        }, 300);
    };

    const loadGoogleTranslate = () => {
        if (window.__gt_loaded) return;
        window.__gt_loaded = true;

        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: 'en',
                    includedLanguages: 'en,hi,as,bn,mr',
                    autoDisplay: false
                },
                'google_translate_element'
            );

            // force remove google top spacing
            document.body.style.top = '0px';
            document.body.style.marginTop = '0px';
            document.documentElement.style.top = '0px';
            document.documentElement.style.marginTop = '0px';

            // agar google banner inject kare to usko bhi hata do
            setTimeout(() => {
                const bannerFrame = document.querySelector('.goog-te-banner-frame');
                const skipTranslate = document.querySelector('body > .skiptranslate');
                const tooltip = document.getElementById('goog-gt-tt');

                if (bannerFrame) bannerFrame.style.display = 'none';
                if (skipTranslate) skipTranslate.style.display = 'none';
                if (tooltip) tooltip.style.display = 'none';

                document.body.style.top = '0px';
                document.body.style.marginTop = '0px';
                document.documentElement.style.top = '0px';
                document.documentElement.style.marginTop = '0px';
            }, 1000);

            const check = setInterval(() => {
                const select = document.querySelector('.goog-te-combo');

                if (select) {
                    window.__gt_ready = true;
                    clearInterval(check);
                    console.log("Translate ready");
                }

                // bar agar baar-baar inject ho to usko continuously reset karo
                document.body.style.top = '0px';
                document.body.style.marginTop = '0px';
                document.documentElement.style.top = '0px';
                document.documentElement.style.marginTop = '0px';
            }, 300);
        };

        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
    };

    return (
        <div className="main-portal-bg">
            <Header />

            <div className='container py-4' style={{ maxWidth: "100%", paddingLeft: "30px", paddingRight: "30px" }}>

                {/* --- PART 1: TOP WHITE COUNTER STRIP --- */}
                <div className="top-counter-ribbon mb-4">

                    <div className="counter-item">

                        <div className="counter-icon"><i className="fas fa-laptop-code"></i></div>

                        <div className="counter-info">

                            <h3>612</h3>

                            <p>Warehouses</p>

                        </div>

                    </div>

                    <div className="counter-item">

                        <div className="counter-icon"><i className="fas fa-university"></i></div>

                        <div className="counter-info">

                            <h3>680</h3>

                            <p>District Hospitals</p>

                        </div>

                    </div>

                    <div className="counter-item">

                        <div className="counter-icon"><i className="fas fa-users"></i></div>

                        <div className="counter-info">

                            <h3>434</h3>

                            <p>Medical Colleges</p>

                        </div>

                    </div>

                    <div className="counter-item">

                        <div className="counter-icon"><i className="fas fa-map-marked-alt"></i></div>

                        <div className="counter-info">

                            <h3>213</h3>

                            <p>Urban Community Health Centres</p>

                        </div>

                    </div>

                    <div className="counter-item">

                        <div className="counter-icon"><i className="fas fa-box-open"></i></div>

                        <div className="counter-info">

                            <h3>6098</h3>

                            <p>Community Health Centres</p>

                        </div>

                    </div>

                    <div className="counter-item">

                        <div className="counter-icon"><i className="fas fa-th-list"></i></div>

                        <div className="counter-info">

                            <h3>4447</h3>

                            <p>Urban Primary Health Centres</p>

                        </div>

                    </div>

                    <div className="counter-item">

                        <div className="counter-icon"><i className="fas fa-laptop-code"></i></div>

                        <div className="counter-info">

                            <h3>1161</h3>

                            <p>Sub District Hospitals</p>

                        </div>

                    </div>

                    <div className="counter-item">

                        <div className="counter-icon"><i className="fas fa-university"></i></div>

                        <div className="counter-info">

                            <h3>26162</h3>

                            <p>AAM PHC</p>

                        </div>

                    </div>

                    <div className="counter-item">

                        <div className="counter-icon"><i className="fas fa-users"></i></div>

                        <div className="counter-info">

                            <h3>132959</h3>

                            <p>AAM SHC</p>

                        </div>

                    </div>

                </div>


                {/* --- SPLIT SCREEN SECTION (ADVANCED SLANTED LAYOUT) --- */}
                <div className="row no-gutters unified-dashboard-box match-height-row">
                    {/* LEFT COLUMN: PART 2 - Facilities Component */}
                    <div className="col-lg-5 left-red-panel">
                        <Facilities />
                    </div>

                    {/* RIGHT COLUMN: PART 3 - Functionalities Scroller Component */}
                    <div className="col-lg-7 right-white-panel">
                        <Functionalities />
                    </div>
                </div>

                {/* --- EXACTLY IN BETWEEN: NOTIFICATION TICKER COMPONENT --- */}
                <div className="mb-2">
                    <NotificationTicker />
                </div>

                {/* --- ENTIRE HOME SLIDER BLOCK WITH FORCED EXTRA SPACE BELOW TICKER --- */}
                <div className="w-100 pt-5 mt-4 clearfix" style={{ clear: "both" }}>
                    <HomeSlider />
                </div>
                <Features />
            </div>

            <Footer />
            <div>
                <a
                    id="calendarShortcut"
                    className="calendar-shortcut"
                    title="Holiday Calendar"
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        setShowCalendar(true);
                    }}
                >
                    <i className="fas fa-calendar-alt" aria-hidden="true"></i>
                </a>
            </div>
            <div className="translate-shortcut-wrapper">
                <a
                    id="translateShortcut"
                    className="translate-shortcut"
                    title="Translate Page"
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        setShowLangMenu((prev) => !prev);
                    }}
                >
                    <i className="fas fa-language" aria-hidden="true"></i>
                </a>

                {showLangMenu && (
                    <div className="translate-language-menu">
                        <button type="button" onClick={() => changeLanguage('en')}>English</button>
                        <button type="button" onClick={() => changeLanguage('hi')}>Hindi</button>
                        <button type="button" onClick={() => changeLanguage('as')}>Assamese</button>
                        <button type="button" onClick={() => changeLanguage('bn')}>Bengali</button>
                        <button type="button" onClick={() => changeLanguage('mr')}>Marathi</button>
                    </div>
                )}
            </div>

            {showMoveToTop &&
                <div>
                    <a
                        id="movetotop"
                        className='movetotop'
                        title="Move to top"
                        href="#"
                        onClick={(e) => handleScrollToTop(e)}>
                        <i className="fas fa-arrow-up" aria-hidden="true"></i>
                    </a>
                </div>
            }

            {/* <div className="bottom-ticker-container">
                <div className="bottom-ticker-text">
                    dvdms.in has been migrated to MoHFW subdomain. Kindly use dvdms.mohfw.gov.in for accessing Central Dashboard. Stockout details for IPHS Drugs are in progress. Meeting link for Diagnostics & Reagents daily @3:00 P.M. onwards:
                    <a href="https://meet.google.com/ckr-jjdk-qev" target="_blank" rel="noreferrer" className="highlight-link">https://meet.google.com/ckr-jjdk-qev</a>
                </div>
            </div> */}

            {showCmsLogin &&
                <CmsLogin isShow={showCmsLogin} onClose={onCloseModal} setShowForgotPass={setShowForgotPass} />
            }
            {showForgotPass &&
                <ForgotPassForm isShow={showForgotPass} onClose={onCloseForgotModal} />
            }
            {showCalendar && <CalendarModal onClose={() => setShowCalendar(false)} />}
            <div id="google_translate_element"></div>

            <AccessibilityWidget />

        </div>
    )
}

export default HomePage;