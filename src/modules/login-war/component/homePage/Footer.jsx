import React from 'react';

const Footer = () => {
    return (
        <>
            {/* Component ke andar hi CSS inject ki gayi hai */}
            <style>{`
                .home-footer {
                    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                    color: #f8fafc;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    padding-top: 30px;
                    padding-bottom: 20px;
                }

                /* Logos styling jo right side links ke upar fit baithegi */
                .footer-right-logos {
                    margin-bottom: 15px;
                }

                .gov-logo {
                    max-height: 40px; /* Thoda chota kiya taaki layout clean lage */
                    object-fit: contain;
                    filter: drop-shadow(0px 1px 2px rgba(0,0,0,0.2)) brightness(1.1); 
                }

                .home-footer h3 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    margin-bottom: 8px;
                    color: #ffffff;
                }

                .home-footer h5 {
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin-bottom: 12px;
                    color: #f1f5f9;
                }

                .border-btm {
                    border-bottom: 2px solid #d97706;
                    width: 50px;
                    margin-bottom: 20px;
                }

                .fs-13 {
                    font-size: 13.5px;
                    color: #cbd5e1;
                    line-height: 1.6;
                }

                /* Scanner Card Customization */
                .scanner-container {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 12px;
                    display: inline-block;
                }

                .scanner-img {
                    width: 110px;
                    height: 110px;
                    object-fit: contain;
                    background: white;
                    padding: 4px;
                    border-radius: 4px;
                }

                .home-footer .golden {
                    color: #fbbf24 !important;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    font-weight: 500;
                }

                .home-footer .golden:hover {
                    color: #ffffff !important;
                    text-decoration: underline;
                }

                .link-divider {
                    color: #475569;
                    padding: 0 10px;
                }

                .footer-disclaimer {
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    margin-top: 30px;
                    padding-top: 20px;
                }

                .pointer {
                    cursor: pointer;
                }
            `}</style>

            <footer className="home-footer">
                
                {/* Main Footer Content */}
                <div className="container-fluid px-4 px-md-5">
                    <div className="row text-center text-md-start">
                        
                        {/* Left Column: Dashboard Info & QR Scanner */}
                        <div className="col-md-6 col-sm-12 mb-4 mb-md-0">
                            <h3>DVDMS Central Dashboard</h3>
                            <p className='fs-13 mb-4'>Ministry of Health &amp; Family Welfare (Govt. of India)</p>
                            
                            {/* QR Scanner Container */}
                            <div className="scanner-container text-center">
                                <img src="scanner-placeholder.png" alt="QR Code Scanner" className="scanner-img mb-2" />
                                <div className="fs-13 text-white" style={{ fontSize: '11px' }}>Scan to Verify</div>
                            </div>
                        </div>

                        {/* Right Column: Logos aur Important Links Dono Yahi Hain */}
                        <div className="col-md-6 col-sm-12 mt-2 mt-md-0">
                            
                            {/* Logos yahan set kar diye hain jahan aapne arrow se bataya tha */}
                            <div className="footer-right-logos row g-3 align-items-center justify-content-center justify-content-md-end mb-4">
                                <div className="col-auto">
                                    <img src="imagesDigi.jpg" alt="Digital India" className="gov-logo" />
                                </div>
                                <div className="col-auto">
                                    <img src="nhmlogo.png" alt="National Health Mission" className="gov-logo" />
                                </div>
                                <div className="col-auto">
                                    <img src="imagesG2.jpg" alt="G20 India" className="gov-logo" />
                                </div>
                                <div className="col-auto">
                                    <img src="imagesAajadi.jpg" alt="Azadi Ka Amrit Mahotsav" className="gov-logo" />
                                </div>
                            </div>

                            <h5>Important Links</h5>
                            <div className="border-btm mx-auto mx-md-0"></div>

                            <ul className="list-unstyled fs-13">
                                <li className="mb-2">
                                    <a className="golden" href="#graphs">Graphs</a>
                                    <span className="link-divider">|</span>
                                    <a className="golden" href="#functionalities">Functionality</a>
                                </li>

                                <li className="mb-2">
                                    <a className="golden" href="#features">Features</a>
                                    <span className="link-divider">|</span>
                                    <a className="golden" href="#state">State/UT DVDMS</a>
                                </li>

                                <li className="mb-2">
                                    <a id="websitePolicy" className="golden pointer">Website Policies</a>
                                    <span className="link-divider">|</span>
                                    <a id="termsOfUse" className="golden pointer">Terms of Use</a>
                                    <span className="link-divider">|</span>
                                    <a id="webManager" className="golden pointer">Web Information Manager</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Disclaimer Section */}
                <div className="container-fluid text-center footer-disclaimer fs-13">
                    <p className="mb-0">
                        <strong>Disclaimer :</strong> Website content managed by{' '}
                        <a href="https://www.mohfw.gov.in/" target="_blank" rel="noreferrer" className='golden'>
                            Ministry of Health and Family Welfare, GOI
                        </a>
                        <br />
                        Design, Developed and Hosted by{' '}
                        <a href="https://www.cdac.in/" target="_blank" rel="noreferrer" className='golden'>
                            CDAC
                        </a>
                    </p>
                </div>
            </footer>
        </>
    );
};

export default Footer;

