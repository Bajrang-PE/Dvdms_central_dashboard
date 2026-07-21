// import React, { useContext, useEffect, useState } from 'react'
// import Header from '../component/homePage/Header'
// import HomeSlider from '../component/homePage/HomeSlider'
// import Facilities from '../component/homePage/Facilities'
// import Functionalities from '../component/homePage/Functionalities'
// import Features from '../component/homePage/Features'
// import Footer from '../component/homePage/Footer'
// import CmsLogin from '../component/homePage/CmsLogin'
// import { LoginContext } from '../context/LoginContext'
// import "./HomePage.css";
// import ForgotPassForm from '../component/homePage/ForgotPassForm'
// import { useAccessibility } from '../hooks/useAccessibility'
// import AccessibilityWidget from "../component/homePage/AccessibilityWidget";
// import NotificationTicker from '../component/homePage/NotificationTicker'
// import CalendarModal from '../component/homePage/CalendarModal';

// const HomePage = () => {
//     const { showCmsLogin, setShowCmsLogin, showForgotPass, setShowForgotPass } = useContext(LoginContext);
//     const [showMoveToTop, setShowMoveToTop] = useState(false);
//     const [showCalendar, setShowCalendar] = useState(false);
//     const [showLangMenu, setShowLangMenu] = useState(false);
//     // 1. Theme State जोड़ें (Default 'blue' रखा है)
// const [showThemeMenu, setShowThemeMenu] = useState(false);
// const [currentTheme, setCurrentTheme] = useState('blue');


// // 2. Theme बदलने वाला फ़ंक्शन
// const handleThemeChange = (themeName) => {
//     setCurrentTheme(themeName);
//     // यह html/body एलिमेंट पर थीम की क्लास/एट्रीब्यूट सेट कर देगा
//     document.documentElement.setAttribute('data-theme', themeName);
//     setShowThemeMenu(false);
// };




//     useEffect(() => {
//         loadGoogleTranslate();

//         const handleScroll = () => {
//             if (window.scrollY > 100) {
//                 setShowMoveToTop(true);
//             } else {
//                 setShowMoveToTop(false);
//             }
//         };

//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);


//     useEffect(() => {
//         const handleClickOutside = (e) => {
//             const wrapper = document.querySelector('.translate-shortcut-wrapper');
//             if (wrapper && !wrapper.contains(e.target)) {
//                 setShowLangMenu(false);
//             }
//         };

//         document.addEventListener('click', handleClickOutside);
//         return () => document.removeEventListener('click', handleClickOutside);
//     }, []);


//     const handleScrollToTop = (e) => {
//         if (e) e.preventDefault();
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     };

//     const onCloseModal = () => {
//         setShowCmsLogin(false);
//         setShowForgotPass(false);
//     }

//     const onCloseForgotModal = () => {
//         setShowForgotPass(false);
//     }

//     const changeLanguage = (lang) => {
//         const applyLanguage = () => {
//             const select = document.querySelector('.goog-te-combo');

//             if (select) {
//                 select.value = lang;
//                 select.dispatchEvent(new Event('change'));
//                 setShowLangMenu(false);
//                 return true;
//             }
//             return false;
//         };

//         let count = 0;
//         const timer = setInterval(() => {
//             count++;
//             if (applyLanguage() || count > 20) {
//                 clearInterval(timer);
//                 if (count > 20) {
//                     console.warn("Translate not ready");
//                 }
//             }
//         }, 300);
//     };

//     const loadGoogleTranslate = () => {
//         if (window.__gt_loaded) return;
//         window.__gt_loaded = true;

//         window.googleTranslateElementInit = () => {
//             new window.google.translate.TranslateElement(
//                 {
//                     pageLanguage: 'en',
//                     includedLanguages: 'en,hi,as,bn,mr',
//                     autoDisplay: false
//                 },
//                 'google_translate_element'
//             );

//             // force remove google top spacing
//             document.body.style.top = '0px';
//             document.body.style.marginTop = '0px';
//             document.documentElement.style.top = '0px';
//             document.documentElement.style.marginTop = '0px';

//             // agar google banner inject kare to usko bhi hata do
//             setTimeout(() => {
//                 const bannerFrame = document.querySelector('.goog-te-banner-frame');
//                 const skipTranslate = document.querySelector('body > .skiptranslate');
//                 const tooltip = document.getElementById('goog-gt-tt');

//                 if (bannerFrame) bannerFrame.style.display = 'none';
//                 if (skipTranslate) skipTranslate.style.display = 'none';
//                 if (tooltip) tooltip.style.display = 'none';

//                 document.body.style.top = '0px';
//                 document.body.style.marginTop = '0px';
//                 document.documentElement.style.top = '0px';
//                 document.documentElement.style.marginTop = '0px';
//             }, 1000);

//             const check = setInterval(() => {
//                 const select = document.querySelector('.goog-te-combo');

//                 if (select) {
//                     window.__gt_ready = true;
//                     clearInterval(check);
//                     console.log("Translate ready");
//                 }

//                 // bar agar baar-baar inject ho to usko continuously reset karo
//                 document.body.style.top = '0px';
//                 document.body.style.marginTop = '0px';
//                 document.documentElement.style.top = '0px';
//                 document.documentElement.style.marginTop = '0px';
//             }, 300);
//         };

//         const script = document.createElement('script');
//         script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
//         script.async = true;
//         document.body.appendChild(script);
//     };

//     return (
//         <div className="main-portal-bg">
//             <Header />

//             <div className='container py-4' style={{ maxWidth: "100%", paddingLeft: "30px", paddingRight: "30px" }}>

//                 {/* --- PART 1: TOP WHITE COUNTER STRIP --- */}
//                 <div className="top-counter-ribbon mb-4">

//                     <div className="counter-item">

//                         <div className="counter-icon"><i className="fas fa-laptop-code"></i></div>

//                         <div className="counter-info">

//                             <h3>612</h3>

//                             <p>Warehouses</p>

//                         </div>

//                     </div>

//                     <div className="counter-item">

//                         <div className="counter-icon"><i className="fas fa-university"></i></div>

//                         <div className="counter-info">

//                             <h3>680</h3>

//                             <p>District Hospitals</p>

//                         </div>

//                     </div>

//                     <div className="counter-item">

//                         <div className="counter-icon"><i className="fas fa-users"></i></div>

//                         <div className="counter-info">

//                             <h3>434</h3>

//                             <p>Medical Colleges</p>

//                         </div>

//                     </div>

//                     <div className="counter-item">

//                         <div className="counter-icon"><i className="fas fa-map-marked-alt"></i></div>

//                         <div className="counter-info">

//                             <h3>213</h3>

//                             <p>Urban Community Health Centres</p>

//                         </div>

//                     </div>

//                     <div className="counter-item">

//                         <div className="counter-icon"><i className="fas fa-box-open"></i></div>

//                         <div className="counter-info">

//                             <h3>6098</h3>

//                             <p>Community Health Centres</p>

//                         </div>

//                     </div>

//                     <div className="counter-item">

//                         <div className="counter-icon"><i className="fas fa-th-list"></i></div>

//                         <div className="counter-info">

//                             <h3>4447</h3>

//                             <p>Urban Primary Health Centres</p>

//                         </div>

//                     </div>

//                     <div className="counter-item">

//                         <div className="counter-icon"><i className="fas fa-laptop-code"></i></div>

//                         <div className="counter-info">

//                             <h3>1161</h3>

//                             <p>Sub District Hospitals</p>

//                         </div>

//                     </div>

//                     <div className="counter-item">

//                         <div className="counter-icon"><i className="fas fa-university"></i></div>

//                         <div className="counter-info">

//                             <h3>26162</h3>

//                             <p>AAM PHC</p>

//                         </div>

//                     </div>

//                     <div className="counter-item">

//                         <div className="counter-icon"><i className="fas fa-users"></i></div>

//                         <div className="counter-info">

//                             <h3>132959</h3>

//                             <p>AAM SHC</p>

//                         </div>

//                     </div>

//                 </div>


//                 {/* --- SPLIT SCREEN SECTION (ADVANCED SLANTED LAYOUT) --- */}
//                 <div className="row no-gutters unified-dashboard-box match-height-row">
//                     {/* LEFT COLUMN: PART 2 - Facilities Component */}
//                     <div className="col-lg-5 left-red-panel">
//                         <Facilities />
//                     </div>

//                     {/* RIGHT COLUMN: PART 3 - Functionalities Scroller Component */}
//                     <div className="col-lg-7 right-white-panel">
//                         <Functionalities />
//                     </div>
//                 </div>

//                 {/* --- EXACTLY IN BETWEEN: NOTIFICATION TICKER COMPONENT --- */}
//                 <div className="mb-2">
//                     <NotificationTicker />
//                 </div>

//                 {/* --- ENTIRE HOME SLIDER BLOCK WITH FORCED EXTRA SPACE BELOW TICKER --- */}
//                 <div className="w-100 pt-5 mt-4 clearfix" style={{ clear: "both" }}>
//                     <HomeSlider />
//                 </div>
//                 <Features />
//             </div>

//             <Footer />
//             <div>
//                 <a
//                     id="calendarShortcut"
//                     className="calendar-shortcut"
//                     title="Holiday Calendar"
//                     href="#"
//                     onClick={(e) => {
//                         e.preventDefault();
//                         setShowCalendar(true);
//                     }}
//                 >
//                     <i className="fas fa-calendar-alt" aria-hidden="true"></i>
//                 </a>
//             </div>
//             <div className="translate-shortcut-wrapper">
//                 <a
//                     id="translateShortcut"
//                     className="translate-shortcut"
//                     title="Translate Page"
//                     href="#"
//                     onClick={(e) => {
//                         e.preventDefault();
//                         setShowLangMenu((prev) => !prev);
//                     }}
//                 >
//                     <i className="fas fa-language" aria-hidden="true"></i>
//                 </a>

//                 {showLangMenu && (
//                     <div className="translate-language-menu">
//                         <button type="button" onClick={() => changeLanguage('en')}>English</button>
//                         <button type="button" onClick={() => changeLanguage('hi')}>Hindi</button>
//                         <button type="button" onClick={() => changeLanguage('as')}>Assamese</button>
//                         <button type="button" onClick={() => changeLanguage('bn')}>Bengali</button>
//                         <button type="button" onClick={() => changeLanguage('mr')}>Marathi</button>
//                     </div>
//                 )}
//             </div>



//             {/* --- THEME PALETTE SHORTCUT BUTTON --- */}
// <div className="theme-shortcut-wrapper">
//     <a
//         id="themeShortcut"
//         className="theme-shortcut"
//         title="Change Theme Color"
//         href="#"
//         onClick={(e) => {
//             e.preventDefault();
//             setShowThemeMenu((prev) => !prev);
//         }}
//     >
//         <i className="fas fa-palette" aria-hidden="true"></i>
//     </a>

//     {showThemeMenu && (
//         <div className="theme-color-menu">
//             <p className="theme-menu-title">Select Theme</p>
//             <div className="theme-options">
//                 <button 
//                     type="button" 
//                     className="theme-btn blue-theme" 
//                     title="Blue Theme"
//                     onClick={() => handleThemeChange('blue')}
//                 ></button>
//                 <button 
//                     type="button" 
//                     className="theme-btn green-theme" 
//                     title="Green Theme"
//                     onClick={() => handleThemeChange('green')}
//                 ></button>
//                 <button 
//                     type="button" 
//                     className="theme-btn red-theme" 
//                     title="Red Theme"
//                     onClick={() => handleThemeChange('red')}
//                 ></button>
//                 <button 
//                     type="button" 
//                     className="theme-btn dark-theme" 
//                     title="Dark Theme"
//                     onClick={() => handleThemeChange('dark')}
//                 ></button>
//             </div>
//         </div>
//     )}
// </div>

//             {showMoveToTop &&
//                 <div>
//                     <a
//                         id="movetotop"
//                         className='movetotop'
//                         title="Move to top"
//                         href="#"
//                         onClick={(e) => handleScrollToTop(e)}>
//                         <i className="fas fa-arrow-up" aria-hidden="true"></i>
//                     </a>
//                 </div>
//             }

//             {/* <div className="bottom-ticker-container">
//                 <div className="bottom-ticker-text">
//                     dvdms.in has been migrated to MoHFW subdomain. Kindly use dvdms.mohfw.gov.in for accessing Central Dashboard. Stockout details for IPHS Drugs are in progress. Meeting link for Diagnostics & Reagents daily @3:00 P.M. onwards:
//                     <a href="https://meet.google.com/ckr-jjdk-qev" target="_blank" rel="noreferrer" className="highlight-link">https://meet.google.com/ckr-jjdk-qev</a>
//                 </div>
//             </div> */}

//             {showCmsLogin &&
//                 <CmsLogin isShow={showCmsLogin} onClose={onCloseModal} setShowForgotPass={setShowForgotPass} />
//             }
//             {showForgotPass &&
//                 <ForgotPassForm isShow={showForgotPass} onClose={onCloseForgotModal} />
//             }
//             {showCalendar && <CalendarModal onClose={() => setShowCalendar(false)} />}
//             <div id="google_translate_element"></div>

//             <AccessibilityWidget />

//         </div>
//     )
// }

// export default HomePage;



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
    // 1. Theme State जोड़ें (Default 'blue' रखा है)
    const [showThemeMenu, setShowThemeMenu] = useState(false);
    const [currentTheme, setCurrentTheme] = useState('blue');

    // 2. Theme बदलने वाला फ़ंक्शन
    const handleThemeChange = (themeName) => {
        setCurrentTheme(themeName);
        // यह html/body एलिमेंट पर थीम की क्लास/एट्रीब्यूट सेट कर देगा
        document.documentElement.setAttribute('data-theme', themeName);
        setShowThemeMenu(false);
    };

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
            {/* Embedded Responsive CSS for Counter Ribbon */}
            <style dangerouslySetInnerHTML={{__html: `
                .top-counter-ribbon {
                    background: #ffffff;
                    border-radius: 8px;
                    padding: 15px 20px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
                    gap: 15px 10px;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                }

                .counter-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    min-width: 0;
                    padding: 4px 6px;
                }

                .counter-icon {
                    font-size: 24px;
                    color: var(--primary-color, #002d80);
                    flex-shrink: 0;
                }

                .counter-info {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    min-width: 0;
                }

                .counter-info h3 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 800;
                    color: #111827;
                    line-height: 1.1;
                }

                .counter-info p {
                    margin: 2px 0 0 0;
                    font-size: 11px;
                    color: #6b7280;
                    font-weight: 500;
                    line-height: 1.2;
                    white-space: normal;
                    word-wrap: break-word;
                }

                @media (max-width: 768px) {
                    .top-counter-ribbon {
                        grid-template-columns: repeat(3, 1fr);
                        padding: 12px 10px;
                    }
                }

                @media (max-width: 480px) {
                    .top-counter-ribbon {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            `}} />

            <Header />

            <div className='container py-4' style={{ maxWidth: "100%", paddingLeft: "30px", paddingRight: "30px" }}>

                {/* --- PART 1: TOP WHITE COUNTER STRIP (NOW FULLY RESPONSIVE) --- */}
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

            {/* --- THEME PALETTE SHORTCUT BUTTON --- */}
            <div className="theme-shortcut-wrapper">
                <a
                    id="themeShortcut"
                    className="theme-shortcut"
                    title="Change Theme Color"
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        setShowThemeMenu((prev) => !prev);
                    }}
                >
                    <i className="fas fa-palette" aria-hidden="true"></i>
                </a>

                {showThemeMenu && (
                    <div className="theme-color-menu">
                        <p className="theme-menu-title">Select Theme</p>
                        <div className="theme-options">
                            <button 
                                type="button" 
                                className="theme-btn blue-theme" 
                                title="Blue Theme"
                                onClick={() => handleThemeChange('blue')}
                            ></button>
                            <button 
                                type="button" 
                                className="theme-btn green-theme" 
                                title="Green Theme"
                                onClick={() => handleThemeChange('green')}
                            ></button>
                            <button 
                                type="button" 
                                className="theme-btn red-theme" 
                                title="Red Theme"
                                onClick={() => handleThemeChange('red')}
                            ></button>
                            <button 
                                type="button" 
                                className="theme-btn dark-theme" 
                                title="Dark Theme"
                                onClick={() => handleThemeChange('dark')}
                            ></button>
                        </div>
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