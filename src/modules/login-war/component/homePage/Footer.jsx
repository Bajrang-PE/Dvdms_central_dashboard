import React, { useState, useEffect, useRef } from 'react';

const Footer = () => {
    const [visitCount, setVisitCount] = useState(0);
    const [lastDeployedDateTime, setLastDeployedDateTime] = useState('');
    const isFetched = useRef(false);

    useEffect(() => {
        fetch(window.location.href, { method: 'HEAD' })
            .then((res) => {
                const lastModified = res.headers.get('Last-Modified');
                if (lastModified) {
                    const dateObj = new Date(lastModified);
                    const formattedDateTime = dateObj.toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    });
                    setLastDeployedDateTime(formattedDateTime);
                } else {
                    throw new Error("No header");
                }
            })
            .catch(() => {
                const currentDateTime = new Date().toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });
                setLastDeployedDateTime(currentDateTime);
            });

        if (isFetched.current) return;
        isFetched.current = true;

        const LOCAL_API_URL = 'https://api.counterapi.dev/v1/dvdms-local-test/visits/up';
        const PROD_API_URL  = 'https://api.counterapi.dev/v1/dvdms-uat-dcservices/visits/up';

        const currentHost = window.location.hostname;
        const isLocalhost = currentHost === 'localhost' || currentHost === '127.0.0.1';
        const TARGET_URL = isLocalhost ? LOCAL_API_URL : PROD_API_URL;

        fetch(TARGET_URL)
            .then((res) => {
                if (!res.ok) throw new Error('Network error');
                return res.json();
            })
            .then((data) => {
                if (data && typeof data.count === 'number') {
                    setVisitCount(data.count);
                } else if (data && typeof data.value === 'number') {
                    setVisitCount(data.value);
                } else {
                    throw new Error('Invalid Data Structure');
                }
            })
            .catch((err) => {
                console.warn("External Counter Issue, using fallback:", err);
                const BASE_COUNT = 10524;
                const stored = localStorage.getItem('dvdms_visits');
                const nextCount = stored ? parseInt(stored, 10) + 1 : BASE_COUNT + 1;
                
                localStorage.setItem('dvdms_visits', nextCount);
                setVisitCount(nextCount);
            });
    }, []);

    return (
        <>
            <style>{`
                .home-footer {
                    /* थीम बदलते ही बैकग्राउंड का कलर अपने आप चेंज होगा */
                    background: var(--primary-color, #0d6efd) !important;
                    color: #ffffff;
                    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                    padding-top: 24px;
                    padding-bottom: 20px;
                    border-top: 3px solid rgba(255, 255, 255, 0.2);
                    position: relative;
                    transition: background-color 0.3s ease;
                }

                .home-footer h3 {
                    font-size: 1.35rem;
                    font-weight: 700;
                    margin-bottom: 2px;
                    color: #ffffff;
                    letter-spacing: -0.2px;
                }

                .sub-heading {
                    font-size: 13px;
                    color: rgba(255, 255, 255, 0.85);
                    margin-bottom: 14px;
                }

                /* Badges Styling */
                .visitor-badge {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 6px;
                    padding: 4px 10px;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 12.5px;
                    color: #ffffff;
                }

                .visitor-number {
                    background: rgba(255, 255, 255, 0.25);
                    color: #ffffff;
                    font-weight: 700;
                    padding: 1px 7px;
                    border-radius: 4px;
                    font-size: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }

                /* Date & Time Centered Badge */
                .last-updated-badge {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid var(--accent-color, #f59e0b);
                    border-radius: 20px;
                    padding: 3px 12px;
                    display: inline-block;
                    font-size: 12px;
                    margin-top: 8px;
                }

                .last-updated-label {
                    color: var(--accent-color, #f59e0b);
                    font-weight: 600;
                }

                .last-updated-val {
                    color: #ffffff;
                    font-weight: 600;
                }

                /* Right Column Logos */
                .gov-logo-card {
                    background: #ffffff;
                    padding: 3px 6px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
                }

                .gov-logo {
                    max-height: 32px;
                    object-fit: contain;
                }

                .home-footer h5 {
                    font-size: 0.95rem;
                    font-weight: 600;
                    margin-bottom: 4px;
                    color: #ffffff;
                }

                .border-btm {
                    border-bottom: 2px solid var(--accent-color, #f59e0b);
                    width: 32px;
                    margin-bottom: 10px;
                }

                .links-list {
                    font-size: 12.5px;
                    color: rgba(255, 255, 255, 0.9);
                    line-height: 1.6;
                }

                .home-footer .golden {
                    color: var(--accent-color, #fba31b) !important;
                    text-decoration: none;
                    transition: color 0.15s ease;
                    font-weight: 500;
                }

                .home-footer .golden:hover {
                    color: #ffffff !important;
                    text-decoration: underline;
                }

                .link-divider {
                    color: rgba(255, 255, 255, 0.4);
                    padding: 0 6px;
                }

                /* Disclaimer Divider */
                .footer-disclaimer {
                    border-top: 1px solid rgba(255, 255, 255, 0.15);
                    margin-top: 18px;
                    padding-top: 12px;
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.85);
                }

                .pointer {
                    cursor: pointer;
                }
            `}</style>

            <footer className="home-footer">
                <div className="container-fluid px-4 px-md-5">
                    <div className="row g-3 align-items-start">
                        
                        {/* Left Column: Title & Total Visits */}
                        <div className="col-lg-4 col-md-5 col-sm-12">
                            <h3>DVDMS Central Dashboard</h3>
                            <div className="sub-heading">Ministry of Health &amp; Family Welfare (Govt. of India)</div>
                            
                            <div className="visitor-badge">
                                <span>Total Visits:</span>
                                <span className="visitor-number">
                                    {visitCount > 0 ? visitCount.toLocaleString() : '...'}
                                </span>
                            </div>
                        </div>

                        {/* Middle Column: Important Links + Center Aligned Date & Time */}
                        <div className="col-lg-5 col-md-7 col-sm-12 text-center pt-2 pt-lg-0">
                            <div className="d-inline-block text-center">
                                <h5>Important Links</h5>
                                <div className="border-btm mx-auto"></div>
                            </div>

                            <ul className="list-unstyled links-list mb-2">
                                <li className="mb-1">
                                    <a className="golden" href="#graphs">Graphs</a>
                                    <span className="link-divider">|</span>
                                    <a className="golden" href="#functionalities">Functionality</a>
                                    <span className="link-divider">|</span>
                                    <a className="golden" href="#features">Features</a>
                                    <span className="link-divider">|</span>
                                    <a className="golden" href="#state">State/UT DVDMS</a>
                                </li>
                                <li>
                                    <a id="websitePolicy" className="golden pointer">Website Policies</a>
                                    <span className="link-divider">|</span>
                                    <a id="termsOfUse" className="golden pointer">Terms of Use</a>
                                    <span className="link-divider">|</span>
                                    <a id="webManager" className="golden pointer">Web Information Manager</a>
                                </li>
                            </ul>

                            {/* Centered Last Updated Date & Time */}
                            {lastDeployedDateTime && (
                                <div className="last-updated-badge">
                                    <span className="last-updated-label">Last Updated: </span>
                                    <span className="last-updated-val">{lastDeployedDateTime}</span>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Government Logos */}
                        <div className="col-lg-3 col-md-12 col-sm-12 d-flex flex-wrap align-items-center justify-content-start justify-content-lg-end gap-2 pt-2 pt-lg-0">
                            <div className="gov-logo-card">
                                <img src="imagesDigi.jpg" alt="Digital India" className="gov-logo" />
                            </div>
                            <div className="gov-logo-card">
                                <img src="nhmlogo.png" alt="National Health Mission" className="gov-logo" />
                            </div>
                            <div className="gov-logo-card">
                                <img src="imagesG2.jpg" alt="G20 India" className="gov-logo" />
                            </div>
                            <div className="gov-logo-card">
                                <img src="imagesAajadi.jpg" alt="Azadi Ka Amrit Mahotsav" className="gov-logo" />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom Disclaimer */}
                <div className="container-fluid text-center footer-disclaimer">
                    <p className="mb-0">
                        <strong>Disclaimer :</strong> Website content managed by{' '}
                        <a href="https://www.mohfw.gov.in/" target="_blank" rel="noreferrer" className='golden'>
                            Ministry of Health and Family Welfare, GOI
                        </a>
                        <span className="mx-2">|</span>
                        Designed, Developed and Hosted by{' '}
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


// import React, { useState, useEffect, useRef } from 'react';

// const Footer = () => {
//     const [visitCount, setVisitCount] = useState(0);
//     const [lastDeployedDateTime, setLastDeployedDateTime] = useState('');
//     const isFetched = useRef(false);

//     useEffect(() => {
//         fetch(window.location.href, { method: 'HEAD' })
//             .then((res) => {
//                 const lastModified = res.headers.get('Last-Modified');
//                 if (lastModified) {
//                     const dateObj = new Date(lastModified);
//                     const formattedDateTime = dateObj.toLocaleString('en-IN', {
//                         day: '2-digit',
//                         month: 'short',
//                         year: 'numeric',
//                         hour: '2-digit',
//                         minute: '2-digit',
//                         hour12: true
//                     });
//                     setLastDeployedDateTime(formattedDateTime);
//                 } else {
//                     throw new Error("No header");
//                 }
//             })
//             .catch(() => {
//                 const currentDateTime = new Date().toLocaleString('en-IN', {
//                     day: '2-digit',
//                     month: 'short',
//                     year: 'numeric',
//                     hour: '2-digit',
//                     minute: '2-digit',
//                     hour12: true
//                 });
//                 setLastDeployedDateTime(currentDateTime);
//             });

//         if (isFetched.current) return;
//         isFetched.current = true;

//         const LOCAL_API_URL = 'https://api.counterapi.dev/v1/dvdms-local-test/visits/up';
//         const PROD_API_URL  = 'https://api.counterapi.dev/v1/dvdms-uat-dcservices/visits/up';

//         const currentHost = window.location.hostname;
//         const isLocalhost = currentHost === 'localhost' || currentHost === '127.0.0.1';
//         const TARGET_URL = isLocalhost ? LOCAL_API_URL : PROD_API_URL;

//         fetch(TARGET_URL)
//             .then((res) => {
//                 if (!res.ok) throw new Error('Network error');
//                 return res.json();
//             })
//             .then((data) => {
//                 if (data && typeof data.count === 'number') {
//                     setVisitCount(data.count);
//                 } else if (data && typeof data.value === 'number') {
//                     setVisitCount(data.value);
//                 } else {
//                     throw new Error('Invalid Data Structure');
//                 }
//             })
//             .catch((err) => {
//                 console.warn("External Counter Issue, using fallback:", err);
//                 const BASE_COUNT = 10524;
//                 const stored = localStorage.getItem('dvdms_visits');
//                 const nextCount = stored ? parseInt(stored, 10) + 1 : BASE_COUNT + 1;
                
//                 localStorage.setItem('dvdms_visits', nextCount);
//                 setVisitCount(nextCount);
//             });
//     }, []);

//     return (
//         <>
//             <style>{`
//                 .home-footer {
//                     background: #0f172a;
//                     color: #f8fafc;
//                     font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
//                     padding-top: 24px;
//                     padding-bottom: 20px;
//                     border-top: 3px solid #3b82f6;
//                     position: relative;
//                 }

//                 .home-footer h3 {
//                     font-size: 1.35rem;
//                     font-weight: 700;
//                     margin-bottom: 2px;
//                     color: #ffffff;
//                     letter-spacing: -0.2px;
//                 }

//                 .sub-heading {
//                     font-size: 13px;
//                     color: #94a3b8;
//                     margin-bottom: 14px;
//                 }

//                 /* Badges Styling */
//                 .visitor-badge {
//                     background: rgba(30, 41, 59, 0.7);
//                     border: 1px solid rgba(59, 130, 246, 0.25);
//                     border-radius: 6px;
//                     padding: 4px 10px;
//                     display: inline-flex;
//                     align-items: center;
//                     gap: 8px;
//                     font-size: 12.5px;
//                     color: #cbd5e1;
//                 }

//                 .visitor-number {
//                     background: #2563eb;
//                     color: #ffffff;
//                     font-weight: 700;
//                     padding: 1px 7px;
//                     border-radius: 4px;
//                     font-size: 12px;
//                 }

//                 /* Date & Time Centered Badge */
//                 .last-updated-badge {
//                     background: rgba(30, 41, 59, 0.7);
//                     border: 1px solid rgba(245, 158, 11, 0.35);
//                     border-radius: 20px;
//                     padding: 3px 12px;
//                     display: inline-block;
//                     font-size: 12px;
//                     margin-top: 8px;
//                 }

//                 .last-updated-label {
//                     color: #f59e0b;
//                     font-weight: 600;
//                 }

//                 .last-updated-val {
//                     color: #f8fafc;
//                     font-weight: 600;
//                 }

//                 /* Right Column Logos */
//                 .gov-logo-card {
//                     background: #ffffff;
//                     padding: 3px 6px;
//                     border-radius: 4px;
//                     display: flex;
//                     align-items: center;
//                     justify-content: center;
//                     box-shadow: 0 1px 4px rgba(0,0,0,0.15);
//                 }

//                 .gov-logo {
//                     max-height: 32px;
//                     object-fit: contain;
//                 }

//                 .home-footer h5 {
//                     font-size: 0.95rem;
//                     font-weight: 600;
//                     margin-bottom: 4px;
//                     color: #f1f5f9;
//                 }

//                 .border-btm {
//                     border-bottom: 2px solid #f59e0b;
//                     width: 32px;
//                     margin-bottom: 10px;
//                 }

//                 .links-list {
//                     font-size: 12.5px;
//                     color: #cbd5e1;
//                     line-height: 1.6;
//                 }

//                 .home-footer .golden {
//                     color: #fba31b !important;
//                     text-decoration: none;
//                     transition: color 0.15s ease;
//                     font-weight: 500;
//                 }

//                 .home-footer .golden:hover {
//                     color: #ffffff !important;
//                     text-decoration: underline;
//                 }

//                 .link-divider {
//                     color: #475569;
//                     padding: 0 6px;
//                 }

//                 /* Disclaimer Divider */
//                 .footer-disclaimer {
//                     border-top: 1px solid rgba(255, 255, 255, 0.08);
//                     margin-top: 18px;
//                     padding-top: 12px;
//                     font-size: 12px;
//                     color: #94a3b8;
//                 }

//                 .pointer {
//                     cursor: pointer;
//                 }
//             `}</style>

//             <footer className="home-footer">
//                 <div className="container-fluid px-4 px-md-5">
//                     <div className="row g-3 align-items-start">
                        
//                         {/* Left Column: Title & Total Visits */}
//                         <div className="col-lg-4 col-md-5 col-sm-12">
//                             <h3>DVDMS Central Dashboard</h3>
//                             <div className="sub-heading">Ministry of Health &amp; Family Welfare (Govt. of India)</div>
                            
//                             <div className="visitor-badge">
//                                 <span>Total Visits:</span>
//                                 <span className="visitor-number">
//                                     {visitCount > 0 ? visitCount.toLocaleString() : '...'}
//                                 </span>
//                             </div>
//                         </div>

//                         {/* Middle Column: Important Links + Center Aligned Date & Time */}
//                         <div className="col-lg-5 col-md-7 col-sm-12 text-center pt-2 pt-lg-0">
//                             <div className="d-inline-block text-center">
//                                 <h5>Important Links</h5>
//                                 <div className="border-btm mx-auto"></div>
//                             </div>

//                             <ul className="list-unstyled links-list mb-2">
//                                 <li className="mb-1">
//                                     <a className="golden" href="#graphs">Graphs</a>
//                                     <span className="link-divider">|</span>
//                                     <a className="golden" href="#functionalities">Functionality</a>
//                                     <span className="link-divider">|</span>
//                                     <a className="golden" href="#features">Features</a>
//                                     <span className="link-divider">|</span>
//                                     <a className="golden" href="#state">State/UT DVDMS</a>
//                                 </li>
//                                 <li>
//                                     <a id="websitePolicy" className="golden pointer">Website Policies</a>
//                                     <span className="link-divider">|</span>
//                                     <a id="termsOfUse" className="golden pointer">Terms of Use</a>
//                                     <span className="link-divider">|</span>
//                                     <a id="webManager" className="golden pointer">Web Information Manager</a>
//                                 </li>
//                             </ul>

//                             {/* Centered Last Updated Date & Time */}
//                             {lastDeployedDateTime && (
//                                 <div className="last-updated-badge">
//                                     <span className="last-updated-label">Last Updated: </span>
//                                     <span className="last-updated-val">{lastDeployedDateTime}</span>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Right Column: Government Logos */}
//                         <div className="col-lg-3 col-md-12 col-sm-12 d-flex flex-wrap align-items-center justify-content-start justify-content-lg-end gap-2 pt-2 pt-lg-0">
//                             <div className="gov-logo-card">
//                                 <img src="imagesDigi.jpg" alt="Digital India" className="gov-logo" />
//                             </div>
//                             <div className="gov-logo-card">
//                                 <img src="nhmlogo.png" alt="National Health Mission" className="gov-logo" />
//                             </div>
//                             <div className="gov-logo-card">
//                                 <img src="imagesG2.jpg" alt="G20 India" className="gov-logo" />
//                             </div>
//                             <div className="gov-logo-card">
//                                 <img src="imagesAajadi.jpg" alt="Azadi Ka Amrit Mahotsav" className="gov-logo" />
//                             </div>
//                         </div>

//                     </div>
//                 </div>

//                 {/* Bottom Disclaimer */}
//                 <div className="container-fluid text-center footer-disclaimer">
//                     <p className="mb-0">
//                         <strong>Disclaimer :</strong> Website content managed by{' '}
//                         <a href="https://www.mohfw.gov.in/" target="_blank" rel="noreferrer" className='golden'>
//                             Ministry of Health and Family Welfare, GOI
//                         </a>
//                         <span className="mx-2">|</span>
//                         Designed, Developed and Hosted by{' '}
//                         <a href="https://www.cdac.in/" target="_blank" rel="noreferrer" className='golden'>
//                             CDAC
//                         </a>
//                     </p>
//                 </div>
//             </footer>
//         </>
//     );
// };

// export default Footer;