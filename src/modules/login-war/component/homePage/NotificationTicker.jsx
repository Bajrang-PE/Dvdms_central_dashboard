import React, { useEffect, useState } from 'react';

const NotificationTicker = () => {
    // Apne notifications list ko update kiya h link support ke saath
    const [notifications, setNotifications] = useState([
        {
            type: "text",
            content: "⚠️ Important Notification regarding Supplier Registration process for year 2026."
        },
        {
            type: "migrated_and_meet", // Isme aapka bataya hua migration message aur meeting link dono hain
            textBeforeLink: "📢 dvdms.in has been migrated to MoHFW subdomain. Kindly use dvdms.mohfw.gov.in for accessing Central Dashboard. Stockout details for IPHS Drugs are in progress. Meeting link for Diagnostics & Reagents daily @3:00 P.M. onwards: ",
            linkText: "https://meet.google.com/ckr-jjdk-qev",
            linkUrl: "https://meet.google.com/ckr-jjdk-qev"
        },
        {
            type: "text",
            content: "🕒 Daily meeting link for Diagnostics & Reagents starts at 3:00 P.M. onwards."
        },
        {
            type: "text",
            content: "📦 New inventory stock updates and report generation tool is now live for testing."
        }
    ]);

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: `
                @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');

                .custom-ticker-container {
                    background: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
                    border: 2px solid #94a3b8;
                    overflow: hidden;
                    margin: 25px 0;
                    border-left: 6px solid #0052cc;
                }

                .ticker-heading-box {
                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                    border-right: 2px solid #94a3b8;
                    padding: 15px 20px;
                    display: flex;
                    align-items: center;
                    position: relative;
                    z-index: 2;
                }

                .ticker-icon-circle {
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                    color: #ffffff;
                    border-radius: 50%;
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    box-shadow: 0 4px 10px rgba(29, 78, 216, 0.3);
                    animation: iconWobble 3s ease-in-out infinite;
                }

                .ticker-text-side {
                    margin-left: 15px;
                }

                .ticker-text-side h2 {
                    font-size: 15px !important;
                    font-weight: 700 !important;
                    color: #0f172a;
                    margin: 0 !important;
                    letter-spacing: -0.3px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    white-space: nowrap;
                }

                .live-badge {
                    background: #ef4444;
                    color: white;
                    font-size: 9px;
                    font-weight: 800;
                    padding: 2px 6px;
                    border-radius: 4px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    animation: pulseBadge 1.5s infinite alternate;
                }

                .ticker-text-side p {
                    font-size: 11px !important;
                    color: #64748b;
                    margin: 0 !important;
                    white-space: nowrap;
                }

                .ticker-content-wrapper {
                    overflow: hidden;
                    padding: 0 15px;
                    width: 100%;
                    position: relative;
                    z-index: 1;
                    background: #ffffff;
                }

                .ticker-scroll-track {
                    display: flex;
                    white-space: nowrap;
                    padding-right: 50px;
                    animation: smoothTickerScroll 35s linear infinite; /* Speed thodi kam ki h taaki lamba text aram se padha ja sake */
                    align-items: center;
                    height: 64px;
                }

                .ticker-scroll-track:hover {
                    animation-play-state: paused;
                    cursor: pointer;
                }

                .ticker-item-text {
                    font-size: 13.5px;
                    font-weight: 600;
                    color: #1e293b;
                    margin-right: 35px;
                    display: inline-flex;
                    align-items: center;
                    background: #f8fafc;
                    padding: 9px 18px;
                    border-radius: 30px;
                    border: 1px solid #cbd5e1;
                    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.04);
                    transition: all 0.2s ease;
                }

                .ticker-item-text:hover {
                    background: #e0f2fe;
                    border-color: #38bdf8;
                    color: #0369a1;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(3, 105, 161, 0.1);
                }

                /* Highlighted Link Style */
                .highlight-link {
                    color: #2563eb !important;
                    text-decoration: underline !important;
                    margin-left: 5px;
                    font-weight: 700;
                }
                
                .highlight-link:hover {
                    color: #1d4ed8 !important;
                }

                @keyframes smoothTickerScroll {
                    0% { transform: translate3d(100%, 0, 0); }
                    100% { transform: translate3d(-100%, 0, 0); }
                }

                @keyframes pulseBadge {
                    0% { opacity: 0.7; box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
                    100% { opacity: 1; box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
                }

                @keyframes iconWobble {
                    0%, 100% { transform: rotate(0deg); }
                    15% { transform: rotate(-8deg) scale(1.02); }
                    30% { transform: rotate(8deg) scale(1.02); }
                    45% { transform: rotate(-4deg); }
                    60% { transform: rotate(4deg); }
                }

                @media (max-width: 767px) {
                    .ticker-heading-box {
                        border-right: none;
                        border-bottom: 2px solid #94a3b8;
                    }
                    .ticker-scroll-track {
                        animation-duration: 25s;
                    }
                }
            `}} />

            <div className="custom-ticker-container mx-md-0 mx-1">
                <div className="row g-0 align-items-center">
                    
                    <div className="col-md-5 col-lg-4 col-xl-3">
                        <div className="ticker-heading-box">
                            <div className="ticker-icon-circle">
                                <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>
                                    brand_awareness
                                </span>
                            </div>
                            <div className="ticker-text-side">
                                <h2>
                                    Circulars <span className="live-badge">Live</span>
                                </h2>
                                <p>Explore our latest news</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-7 col-lg-8 col-xl-9 d-flex align-items-center">
                        <div className="ticker-content-wrapper">
                            <div className="ticker-scroll-track">
                                {notifications.length > 0 ? (
                                    notifications.map((note, index) => {
                                        // Agar simple text notification h
                                        if (note.type === "text") {
                                            return (
                                                <span key={index} className="ticker-item-text">
                                                    {note.content}
                                                </span>
                                            );
                                        }
                                        
                                        // Agar migration aur meeting link wala specific notification h
                                        if (note.type === "migrated_and_meet") {
                                            return (
                                                <span key={index} className="ticker-item-text">
                                                    {note.textBeforeLink}
                                                    <a 
                                                        href={note.linkUrl} 
                                                        target="_blank" 
                                                        rel="noreferrer" 
                                                        className="highlight-link"
                                                    >
                                                        {note.linkText}
                                                    </a>
                                                </span>
                                            );
                                        }
                                        return null;
                                    })
                                ) : (
                                    <span className="ticker-item-text text-muted">
                                        No new notifications available.
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default NotificationTicker;