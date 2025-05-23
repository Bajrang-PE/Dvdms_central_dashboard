import React, { useContext, useEffect, useState } from 'react'
import Header from '../component/homePage/Header'
import HomeSlider from '../component/homePage/HomeSlider'
import Facilities from '../component/homePage/Facilities'
import Functionalities from '../component/homePage/Functionalities'
import Features from '../component/homePage/Features'
import StateUts from '../component/homePage/StateUts'
import Footer from '../component/homePage/Footer'
import CmsLogin from '../component/homePage/CmsLogin'
import { LoginContext } from '../context/LoginContext'
import ForgotPassForm from '../component/homePage/ForgotPassForm'

const HomePage = () => {
    const { showCmsLogin, setShowCmsLogin, showForgotPass, setShowForgotPass } = useContext(LoginContext);
    const [showMoveToTop, setShowMoveToTop] = useState(false);

    useEffect(() => {
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

    const handleScrollToTop = (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const onCloseModal = () => {
        setShowCmsLogin(false);
        setShowForgotPass(false);
    }


    return (
        <div>
            <Header />
            <HomeSlider />

            <div className='container py-4' style={{ maxWidth: "100%" }}>
                <Facilities />
                {/* <hr className='w-50' /> */}
                {/* <Graphs /> */}
                <hr className='w-50' />
                <Functionalities />
                <hr className='w-50' />
                <Features />
                <hr className='w-50' />
                <StateUts />

                {/* <Slider/> */}
            </div>
            <Footer />
            {showMoveToTop &&
                <div>
                    <a
                        id="movetotop"
                        className='movetotop'
                        title="Move to top"
                        href="#"
                        onClick={() => handleScrollToTop()}>
                        <i className="fas fa-arrow-up" aria-hidden="true"></i>
                    </a>
                </div>
            }

            <div className="bottom-ticker-container">
                <div className="bottom-ticker-text">
                    dvdms.in has been migrated to MoHFW subdomain. Kindly use dvdms.mohfw.gov.in for accessing Central Dashboard. Stockout details for IPHS Drugs are in progress. Meeting link for Diagnostics & Reagents daily @3:00 P.M. onwards:
                    <a href="https://meet.google.com/ckr-jjdk-qev" target="_blank" className="highlight-link">https://meet.google.com/ckr-jjdk-qev</a>
                </div>
            </div>
            {showCmsLogin &&
                <CmsLogin isShow={showCmsLogin} onClose={onCloseModal} setShowForgotPass={setShowForgotPass}/>
            }
            {showForgotPass &&
                <ForgotPassForm isShow={showForgotPass} onClose={onCloseModal} />
            }

        </div>
    )
}

export default HomePage
