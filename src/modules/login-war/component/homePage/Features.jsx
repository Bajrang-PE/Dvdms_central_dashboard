// import React from 'react';
// import useScrollVisibility from '../../hooks/useScrollAnimation';

// const Features = () => {
//     const isVisible = useScrollVisibility('features');

//     return (
//         <div className="features-section-container w-100 my-5" id="features" style={{ padding: "0 20px" }}>
//             <style dangerouslySetInnerHTML={{
//                 __html: `
//                 /* Professional Enterprise Theme Styles */
//                 .features-split-wrapper {
//                     display: flex;
//                     gap: 32px;
//                     width: 100%;
//                     font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
//                 }

//                 /* --- LEFT COLUMN: NEWS --- */
//                 .news-left-panel {
//                     flex: 0 0 46%;
//                     max-width: 46%;
//                     display: flex;
//                     flex-direction: column;
//                 }

//                 .panel-main-title {
//                     font-size: 24px;
//                     font-weight: 700;
//                     color: #111827;
//                     margin: 0 0 4px 0;
//                     letter-spacing: -0.5px;
//                 }

//                 .panel-sub-tagline {
//                     font-size: 13px;
//                     color: #4b5563;
//                     margin: 0 0 24px 0;
//                     font-weight: 400;
//                 }

//                 .news-items-stack {
//                     display: flex;
//                     flex-direction: column;
//                     gap: 12px;
//                 }

//                 .news-card {
//                     background: #ffffff;
//                     border: 1px solid #e2e8f0;
//                     border-radius: 8px;
//                     padding: 14px 16px;
//                     display: flex;
//                     align-items: center;
//                     gap: 16px;
//                     position: relative;
//                     transition: all 0.2s ease-in-out;
//                 }

//                 .news-card:hover {
//                     border-color: #cbd5e1;
//                     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
//                 }

//                 .news-source-badge {
//                     display: flex;
//                     flex-direction: column;
//                     align-items: center;
//                     justify-content: center;
//                     min-width: 56px;
//                     max-width: 56px;
//                     height: 52px;
//                     border-radius: 6px;
//                     font-size: 11px;
//                     text-align: center;
//                 }

//                 .badge-air {
//                     background-color: #f0f7ff;
//                     color: #1d4ed8;
//                     border: 1px solid #bfdbfe;
//                 }

//                 .badge-dd {
//                     background-color: #fef2f2;
//                     color: #dc2626;
//                     border: 1px solid #fecaca;
//                 }

//                 .badge-icon-text {
//                     font-size: 13px;
//                     font-weight: 800;
//                     line-height: 1.1;
//                 }

//                 .badge-sub-text {
//                     font-size: 9.5px;
//                     font-weight: 600;
//                     margin-top: 1px;
//                     letter-spacing: 0.2px;
//                 }

//                 .news-content-area {
//                     flex: 1;
//                     display: flex;
//                     flex-direction: column;
//                     gap: 2px;
//                     padding-right: 75px;
//                 }

//                 .news-meta-header {
//                     font-size: 10.5px;
//                     font-weight: 600;
//                     color: #9ca3af;
//                     text-transform: uppercase;
//                     letter-spacing: 0.5px;
//                 }

//                 .news-headline-text {
//                     font-size: 13.5px;
//                     font-weight: 600;
//                     color: #1f2937;
//                     line-height: 1.45;
//                     margin: 0;
//                 }

//                 .news-time-stamp {
//                     position: absolute;
//                     top: 14px;
//                     right: 16px;
//                     font-size: 11px;
//                     color: #9ca3af;
//                     font-weight: 500;
//                 }

//                 /* --- RIGHT PANEL: SPOTLIGHT (50/50 CLEAN ROW SPLIT) --- */
//                 .spotlight-right-panel {
//                     flex: 0 0 54%;
//                     max-width: 54%;
//                     display: flex;
//                     flex-direction: column;
//                 }

//                 .spotlight-box-wrapper {
//                     border: 1px solid #e2e8f0;
//                     border-radius: 8px;
//                     overflow: hidden;
//                     background: #ffffff;
//                     display: flex;
//                     height: 100%;
//                     min-height: 440px;
//                     box-shadow: 0 1px 3px rgba(0,0,0,0.02);
//                 }

//                 /* Left Block (Visual Asset + Red Description Frame) */
//                 .spotlight-left-subframe {
//                     flex: 0 0 50%;
//                     max-width: 50%;
//                     display: flex;
//                     flex-direction: column;
//                     border-right: 1px solid #e2e8f0;
//                 }

//                 .spotlight-image-frame {
//                     width: 100%;
//                     height: 170px;
//                     background: #ffffff;
//                     display: flex;
//                     align-items: center;
//                     justify-content: center;
//                     padding: 12px;
//                 }

//                 .spotlight-image-frame img {
//                     max-width: 100%;
//                     max-height: 100%;
//                     object-fit: contain;
//                 }

//                 .spotlight-red-desc {
//                     background: #991b1b; 
//                     color: #ffffff;
//                     padding: 20px;
//                     flex: 1;
//                     display: flex;
//                     flex-direction: column;
//                     justify-content: flex-start;
//                 }

//                 .spotlight-month-tag {
//                     font-size: 10.5px;
//                     text-transform: uppercase;
//                     letter-spacing: 0.8px;
//                     opacity: 0.75;
//                     margin-bottom: 6px;
//                     font-weight: 600;
//                 }

//                 .spotlight-main-heading {
//                     font-size: 17px;
//                     font-weight: 700;
//                     margin: 0 0 8px 0;
//                     letter-spacing: -0.3px;
//                 }

//                 .spotlight-body-desc {
//                     font-size: 12px;
//                     line-height: 1.55;
//                     opacity: 0.9;
//                     margin: 0;
//                     font-weight: 400;
//                     text-align: justify;
//                 }

//                 /* Right Block (Polished Linear Features Side Menu) */
//                 .features-side-list {
//                     flex: 0 0 50%;
//                     max-width: 50%;
//                     padding: 16px 20px;
//                     display: flex;
//                     flex-direction: column;
//                     justify-content: space-between;
//                     background: #fcfcfd;
//                 }

//                 .side-feature-row {
//                     display: flex;
//                     align-items: center;
//                     justify-content: flex-start;
//                     gap: 16px;
//                     padding: 10px 0;
//                     border-bottom: 1px dashed #e2e8f0;
//                 }

//                 .side-feature-row:last-child {
//                     border-bottom: none;
//                 }

//                 .side-feature-left {
//                     display: flex;
//                     align-items: center;
//                     gap: 12px;
//                     flex: 0 0 auto;
//                 }

//                 .feature-meta-tag {
//                     font-size: 9.5px;
//                     color: #9ca3af;
//                     font-weight: 700;
//                     text-transform: uppercase;
//                     letter-spacing: 0.5px;
//                     margin-bottom: 1px;
//                 }

//                 .timeline-icon-wrap {
//                     width: 30px;
//                     height: 30px;
//                     background: #f0f7ff;
//                     color: #2563eb;
//                     border-radius: 50%;
//                     display: flex;
//                     justify-content: center;
//                     align-items: center;
//                     font-size: 12px;
//                     flex-shrink: 0;
//                 }

//                 .timeline-feature-text h5 {
//                     font-size: 13px;
//                     font-weight: 600;
//                     color: #374151;
//                     margin: 0;
//                 }

//                 /* Right Side Feature Image Styling */
//                 .side-feature-right-img {
//                     width: 28px;
//                     height: 28px;
//                     object-fit: contain;
//                     flex-shrink: 0;
//                 }

//                 /* Responsive Breakpoints */
//                 @media (max-width: 1024px) {
//                     .features-split-wrapper {
//                         flex-direction: column;
//                         gap: 35px;
//                     }
//                     .news-left-panel, .spotlight-right-panel {
//                         flex: 0 0 100%;
//                         max-width: 100%;
//                     }
//                 }

//                 @media (max-width: 640px) {
//                     .spotlight-box-wrapper {
//                         flex-direction: column;
//                     }
//                     .spotlight-left-subframe, .features-side-list {
//                         flex: 0 0 100%;
//                         max-width: 100%;
//                     }
//                     .spotlight-left-subframe {
//                         border-right: none;
//                         border-bottom: 1px solid #e2e8f0;
//                     }
//                 }
//             `}} />

//             <div className={`features-split-wrapper ${isVisible ? 'slide-in' : ''}`}>

//                 {/* --- LEFT PANEL: NEWS / PRESS RELEASE --- */}
//                 <div className="news-left-panel">
//                     <h2 className="panel-main-title">Notice</h2>
//                     <p className="panel-sub-tagline">Your Gateway to Authentic Notice</p>

//                     <div className="news-items-stack">
//                         <div className="news-card">
//                             <div className="news-source-badge badge-air">
//                                 <span className="badge-icon-text">NLEM</span>
//                                 <span className="badge-sub-text"></span>
//                             </div>
//                             <div className="news-content-area">
//                                 <div className="news-meta-header">Notice</div>
//                                 <h4 className="news-headline-text">Essential Medicines to be made available at SHC and PHC level</h4>
//                             </div>
//                             <span className="news-time-stamp"></span>
//                         </div>

//                         <div className="news-card">
//                             <div className="news-source-badge badge-air">
//                                 <span className="badge-icon-text">NLEM</span>
//                                 <span className="badge-sub-text"></span>
//                             </div>
//                             <div className="news-content-area">
//                                 <div className="news-meta-header">Notice</div>
//                                 <h4 className="news-headline-text">Annexure : Essential Medicine List for SHC and PHC level</h4>
//                             </div>
//                             <span className="news-time-stamp"></span>
//                         </div>

//                         <div className="news-card">
//                             <div className="news-source-badge badge-air">
//                                 <span className="badge-icon-text">IPHS</span>
//                                 <span className="badge-sub-text"></span>
//                             </div>
//                             <div className="news-content-area">
//                                 <div className="news-meta-header">Notice</div>
//                                 <h4 className="news-headline-text">D.O letter : Prioritise implementation of DVDMS up to Drug Distribution Center level</h4>
//                             </div>
//                             <span className="news-time-stamp"></span>
//                         </div>

//                         <div className="news-card">
//                             <div className="news-source-badge badge-dd">
//                                 <span className="badge-icon-text">Diagnost</span>
//                                 <span className="badge-sub-text"></span>
//                             </div>
//                             <div className="news-content-area">
//                                 <div className="news-meta-header">Notice</div>
//                                 <h4 className="news-headline-text">D.O letter Attached format of Drug Procurement and Logistics Systems-FDSI</h4>
//                             </div>
//                             <span className="news-time-stamp"></span>
//                         </div>

//                         <div className="news-card">
//                             <div className="news-source-badge badge-dd">
//                                 <span className="badge-icon-text">Diagnost</span>
//                                 <span className="badge-sub-text"></span>
//                             </div>
//                             <div className="news-content-area">
//                                 <div className="news-meta-header">Notice</div>
//                                 <h4 className="news-headline-text">D.O letter : Implementation of Free Drug Initiative in all States/UTs & Facility wise EDL</h4>
//                             </div>
//                             <span className="news-time-stamp"></span>
//                         </div>

//                         <div className="news-card">
//                             <div className="news-source-badge badge-dd">
//                                 <span className="badge-icon-text">Diagnost</span>
//                                 <span className="badge-sub-text"></span>
//                             </div>
//                             <div className="news-content-area">
//                                 <div className="news-meta-header">Notice</div>
//                                 <h4 className="news-headline-text">D.O letter : Funding under NHM for Free Drugs Service</h4>
//                             </div>
//                             <span className="news-time-stamp"></span>
//                         </div>

//                         <div className="news-card">
//                             <div className="news-source-badge badge-dd">
//                                 <span className="badge-icon-text">Diagnost</span>
//                                 <span className="badge-sub-text"></span>
//                             </div>
//                             <div className="news-content-area">
//                                 <div className="news-meta-header">Notice</div>
//                                 <h4 className="news-headline-text">Operational Guidelines-Free Drugs Service Initiative</h4>
//                             </div>
//                             <span className="news-time-stamp"></span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* --- RIGHT PANEL: HIGH-FINISH SPOTLIGHT CONTAINER --- */}
//                 <div className="spotlight-right-panel">
//                     <h2 className="panel-main-title">Features</h2>

//                     <p className="panel-sub-tagline">
//                         Integrated Drug & Vaccine Distribution Dashboard | Ministry of Health & Family Welfare, Govt. of India
//                     </p>

//                     <div className="spotlight-box-wrapper">

//                         {/* LEFT INNER SUBFRAME: Image Asset + Rich Technical Description */}
//                         <div className="spotlight-left-subframe">
//                             <div className="spotlight-image-frame">
//                                 <img src="/dvdms/supplychain.jpg" alt="Pharmaceutical Supply Chain Logistical Wireframe" />
//                             </div>

//                             <div className="spotlight-red-desc">
//                                 <div className="spotlight-month-tag"></div>
//                                 <h4 className="spotlight-main-heading">DVDMS Central Dashboard</h4>

//                                 {/* Paragraph */}
//                                 <p className="spotlight-body-desc">
//                                     The DVDMS Central Dashboard delivers an enterprise-grade analytical and monitoring framework for the Integrated Drug and Vaccine Distribution Management System. It enables real-time tracking of procurement lifecycles, inventory levels, stock thresholds, and distribution pipelines across multiple tiers of the public health supply chain. By transforming complex pharmaceutical and logistics data into actionable visual insights, the platform supports evidence-based decision-making, improves supply chain transparency, and helps optimize the availability of essential medicines and vaccines across state and district health networks.
//                                 </p>

//                                 {/* Paragraph ke niche second image */}
//                                 <div className="spotlight-second-image-wrap mt-3 text-center">
//                                     <img 
//                                         src="/dvdms/ChatGPTdata.jpg" 
//                                         alt="Second Feature Asset" 
//                                         style={{
//                                             maxWidth: '100%',
//                                             height: 'auto',
//                                             borderRadius: '4px',
//                                             objectFit: 'contain'
//                                         }}
//                                     />
//                                 </div>

//                             </div>
//                         </div>

//                         {/* RIGHT INNER SUBFRAME: Features Stack List */}
//                         <div className="features-side-list">
//                             {[
//                                 { tag: "", icon: "far fa-chart-bar", label: "Real-time Statistics", rightImage: "/dvdms/real-time.jpg" },
//                                 { tag: "", icon: "fas fa-user-tie", label: "Role Based User Access", rightImage: "/dvdms/role-main.png" }, 
//                                 { tag: "", icon: "fas fa-filter", label: "Advanced Filter Engine", rightImage: "/dvdms/imagesfilter.jpg" },
//                                 { tag: "", icon: "fas fa-level-down-alt", label: "Granular Drill Down Reports", rightImage: "/dvdms/imagesDrill.png" },
//                                 { tag: "", icon: "fas fa-compress-alt", label: "Multi-Warehouse Comparison", rightImage: "/dvdms/images-multi.png" },
//                                 { tag: "", icon: "fas fa-cogs", label: "Predictive Demand Planning", rightImage: "/dvdms/imagesdemand.jpg" }
//                             ].map((item, index) => (
//                                 <div key={index} className="side-feature-row">
//                                     <div className="side-feature-left">
//                                         <div className="timeline-icon-wrap">
//                                             <i className={item.icon}></i>
//                                         </div>
//                                         <div className="timeline-feature-text">
//                                             {item.tag && <div className="feature-meta-tag">{item.tag}</div>}
//                                             <h5>{item.label}</h5>
//                                         </div>
//                                     </div>

//                                     {/* Right Side Image */}
//                                     {item.rightImage && (
//                                         <img 
//                                             src={item.rightImage} 
//                                             alt={item.label} 
//                                             className="side-feature-right-img"
//                                         />
//                                     )}
//                                 </div>
//                             ))}
//                         </div>

//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default Features;





import React from 'react';
import useScrollVisibility from '../../hooks/useScrollAnimation';

const Features = () => {
    const isVisible = useScrollVisibility('features');

    return (
        <div className="features-section-container w-100 my-5" id="features" style={{ padding: "0 20px" }}>
            <style dangerouslySetInnerHTML={{
                __html: `
                /* Professional Enterprise Theme Styles */
                .features-split-wrapper {
                    display: flex;
                    gap: 32px;
                    width: 100%;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
                }

                /* --- LEFT COLUMN: NEWS --- */
                .news-left-panel {
                    flex: 0 0 46%;
                    max-width: 46%;
                    display: flex;
                    flex-direction: column;
                }

                .panel-main-title {
                    font-size: 24px;
                    font-weight: 700;
                    color: #111827;
                    margin: 0 0 4px 0;
                    letter-spacing: -0.5px;
                }

                .panel-sub-tagline {
                    font-size: 13px;
                    color: #4b5563;
                    margin: 0 0 24px 0;
                    font-weight: 400;
                }

                .news-items-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .news-card {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 14px 16px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    position: relative;
                    transition: all 0.2s ease-in-out;
                }

                .news-card:hover {
                    border-color: #cbd5e1;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
                }

                .news-source-badge {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-width: 56px;
                    max-width: 56px;
                    height: 52px;
                    border-radius: 6px;
                    font-size: 11px;
                    text-align: center;
                }

                .badge-air {
                    background-color: #f0f7ff;
                    color: #1d4ed8;
                    border: 1px solid #bfdbfe;
                }

                .badge-dd {
                    background-color: #fef2f2;
                    color: #dc2626;
                    border: 1px solid #fecaca;
                }

                .badge-icon-text {
                    font-size: 13px;
                    font-weight: 800;
                    line-height: 1.1;
                }

                .badge-sub-text {
                    font-size: 9.5px;
                    font-weight: 600;
                    margin-top: 1px;
                    letter-spacing: 0.2px;
                }

                .news-content-area {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    padding-right: 75px;
                }

                .news-meta-header {
                    font-size: 10.5px;
                    font-weight: 600;
                    color: #9ca3af;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .news-headline-text {
                    font-size: 13.5px;
                    font-weight: 600;
                    color: #1f2937;
                    line-height: 1.45;
                    margin: 0;
                }

                .news-time-stamp {
                    position: absolute;
                    top: 14px;
                    right: 16px;
                    font-size: 11px;
                    color: #9ca3af;
                    font-weight: 500;
                }

                /* --- RIGHT PANEL: SPOTLIGHT (50/50 CLEAN ROW SPLIT) --- */
                .spotlight-right-panel {
                    flex: 0 0 54%;
                    max-width: 54%;
                    display: flex;
                    flex-direction: column;
                }

                .spotlight-box-wrapper {
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    overflow: hidden;
                    background: #ffffff;
                    display: flex;
                    height: 100%;
                    min-height: 440px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
                }

                /* Left Block (Visual Asset + Red Description Frame) */
                .spotlight-left-subframe {
                    flex: 0 0 50%;
                    max-width: 50%;
                    display: flex;
                    flex-direction: column;
                    border-right: 1px solid #e2e8f0;
                }

                .spotlight-image-frame {
                    width: 100%;
                    height: 170px;
                    background: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 12px;
                }

                .spotlight-image-frame img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                }

                .spotlight-red-desc {
                    background: #991b1b; 
                    color: #ffffff;
                    padding: 20px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                }

                .spotlight-month-tag {
                    font-size: 10.5px;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    opacity: 0.75;
                    margin-bottom: 6px;
                    font-weight: 600;
                }

                .spotlight-main-heading {
                    font-size: 17px;
                    font-weight: 700;
                    margin: 0 0 8px 0;
                    letter-spacing: -0.3px;
                }

                .spotlight-body-desc {
                    font-size: 12px;
                    line-height: 1.55;
                    opacity: 0.9;
                    margin: 0;
                    font-weight: 400;
                    text-align: justify;
                }

                /* Right Block (Polished Linear Features Side Menu) */
                .features-side-list {
                    flex: 0 0 50%;
                    max-width: 50%;
                    padding: 16px 20px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    background: #fcfcfd;
                }

                .side-feature-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px 0;
                    border-bottom: 1px dashed #e2e8f0;
                }

                .side-feature-row:last-child {
                    border-bottom: none;
                }

                .side-feature-left {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }

                .feature-meta-tag {
                    font-size: 9.5px;
                    color: #9ca3af;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 1px;
                }

                .timeline-icon-wrap {
                    width: 30px;
                    height: 30px;
                    background: #f0f7ff;
                    color: #2563eb;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 12px;
                    flex-shrink: 0;
                }

                .timeline-feature-text h5 {
                    font-size: 13px;
                    font-weight: 600;
                    color: #374151;
                    margin: 0;
                }

                /* Right Side Feature Image Styling */
                .side-feature-right-img {
                    width: 32px;
                    height: 32px;
                    object-fit: contain;
                    flex-shrink: 0;
                }

                /* Responsive Breakpoints */
                @media (max-width: 1024px) {
                    .features-split-wrapper {
                        flex-direction: column;
                        gap: 35px;
                    }
                    .news-left-panel, .spotlight-right-panel {
                        flex: 0 0 100%;
                        max-width: 100%;
                    }
                }

                @media (max-width: 640px) {
                    .spotlight-box-wrapper {
                        flex-direction: column;
                    }
                    .spotlight-left-subframe, .features-side-list {
                        flex: 0 0 100%;
                        max-width: 100%;
                    }
                    .spotlight-left-subframe {
                        border-right: none;
                        border-bottom: 1px solid #e2e8f0;
                    }
                }
            `}} />

            <div className={`features-split-wrapper ${isVisible ? 'slide-in' : ''}`}>

                {/* --- LEFT PANEL: NEWS / PRESS RELEASE --- */}
                <div className="news-left-panel">
                    <h2 className="panel-main-title">Notice</h2>
                    <p className="panel-sub-tagline">Your Gateway to Authentic Notice</p>

                    <div className="news-items-stack">

                        <div className="news-card">
                            <div className="news-source-badge badge-air">
                                <span className="badge-icon-text">NLEM</span>
                                <span className="badge-sub-text"></span>
                            </div>
                            <div className="news-content-area">
                                <div className="news-meta-header">Notice</div>
                                <h4 className="news-headline-text">Essential Medicines to be made available at SHC and PHC level</h4>
                            </div>
                            <span className="news-time-stamp"></span>
                        </div>

                        <div className="news-card">
                            <div className="news-source-badge badge-air">
                                <span className="badge-icon-text">NLEM</span>
                                <span className="badge-sub-text"></span>
                            </div>
                            <div className="news-content-area">
                                <div className="news-meta-header">Notice</div>
                                <h4 className="news-headline-text">Annexure : Essential Medicine List for SHC and PHC level</h4>
                            </div>
                            <span className="news-time-stamp"></span>
                        </div>

                        <div className="news-card">
                            <div className="news-source-badge badge-air">
                                <span className="badge-icon-text">IPHS</span>
                                <span className="badge-sub-text"></span>
                            </div>
                            <div className="news-content-area">
                                <div className="news-meta-header">Notice</div>
                                <h4 className="news-headline-text">D.O letter : Prioritise implementation of DVDMS up to Drug Distribution Center level</h4>
                            </div>
                            <span className="news-time-stamp"></span>
                        </div>

                        <div className="news-card">
                            <div className="news-source-badge badge-dd">
                                <span className="badge-icon-text">Diagnos</span>
                                <span className="badge-sub-text"></span>
                            </div>
                            <div className="news-content-area">
                                <div className="news-meta-header">Notice</div>
                                <h4 className="news-headline-text">D.O letter Attached format of Drug Procurement and Logistics Systems-FDSI</h4>
                            </div>
                            <span className="news-time-stamp"></span>
                        </div>

                        <div className="news-card">
                            <div className="news-source-badge badge-dd">
                                <span className="badge-icon-text">Diagnos</span>
                                <span className="badge-sub-text"></span>
                            </div>
                            <div className="news-content-area">
                                <div className="news-meta-header">Notice</div>
                                <h4 className="news-headline-text">D.O letter : Implementation of Free Drug Initiative in all States/UTs & Facility wise EDL</h4>
                            </div>
                            <span className="news-time-stamp"></span>
                        </div>

                        <div className="news-card">
                            <div className="news-source-badge badge-dd">
                                <span className="badge-icon-text">Diagnos</span>
                                <span className="badge-sub-text"></span>
                            </div>
                            <div className="news-content-area">
                                <div className="news-meta-header">Notice</div>
                                <h4 className="news-headline-text">D.O letter : Funding under NHM for Free Drugs Service</h4>
                            </div>
                            <span className="news-time-stamp"></span>
                        </div>

                        <div className="news-card">
                            <div className="news-source-badge badge-dd">
                                <span className="badge-icon-text">Diagnos</span>
                                <span className="badge-sub-text"></span>
                            </div>
                            <div className="news-content-area">
                                <div className="news-meta-header">Notice</div>
                                <h4 className="news-headline-text">Operational Guidelines-Free Drugs Service Initiative</h4>
                            </div>
                            <span className="news-time-stamp"></span>
                        </div>

                    </div>

                </div>

                {/* --- RIGHT PANEL: HIGH-FINISH SPOTLIGHT CONTAINER --- */}
                <div className="spotlight-right-panel">
                    <h2 className="panel-main-title">Features</h2>

                    <p className="panel-sub-tagline">
                        Integrated Drug & Vaccine Distribution Dashboard | Ministry of Health & Family Welfare, Govt. of India
                    </p>

                    <div className="spotlight-box-wrapper">

                        {/* LEFT INNER SUBFRAME: Image Asset + Rich Technical Description */}
                        <div className="spotlight-left-subframe">
                            <div className="spotlight-image-frame">
                                <img src="/dvdms/supplychain.jpg" alt="Pharmaceutical Supply Chain Logistical Wireframe" />
                            </div>

                            <div className="spotlight-red-desc">
                                <div className="spotlight-month-tag"></div>
                                <h4 className="spotlight-main-heading">DVDMS Central Dashboard</h4>

                                {/* Paragraph */}
                                <p className="spotlight-body-desc">
                                    The DVDMS Central Dashboard delivers an enterprise-grade analytical and monitoring framework for the Integrated Drug and Vaccine Distribution Management System. It enables real-time tracking of procurement lifecycles, inventory levels, stock thresholds, and distribution pipelines across multiple tiers of the public health supply chain. By transforming complex pharmaceutical and logistics data into actionable visual insights, the platform supports evidence-based decision-making, improves supply chain transparency, and helps optimize the availability of essential medicines and vaccines across state and district health networks.
                                </p>

                                {/* Paragraph ke niche second image */}
                                <div className="spotlight-second-image-wrap mt-3 text-center">
                                    <img
                                        src="/dvdms/ChatGPTdata.jpg"
                                        alt="Second Feature Asset"
                                        style={{
                                            maxWidth: '100%',
                                            height: 'auto',
                                            borderRadius: '4px',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </div>

                            </div>
                        </div>

                        {/* RIGHT INNER SUBFRAME: Features Stack List */}
                        <div className="features-side-list">
                            {[
                                { tag: "", icon: "far fa-chart-bar", label: "Real-time Statistics", rightImage: "/dvdms/real-time.jpg" },
                                { tag: "", icon: "fas fa-user-tie", label: "Role Based User Access", rightImage: "/dvdms/role-main.png" },
                                { tag: "", icon: "fas fa-filter", label: "Advanced Filter Engine", rightImage: "/dvdms/imagesfilter.jpg" },
                                { tag: "", icon: "fas fa-level-down-alt", label: "Granular Drill Down Reports", rightImage: "/dvdms/imagesDrill.png" },
                                { tag: "", icon: "fas fa-compress-alt", label: "Multi-Warehouse Comparison", rightImage: "/dvdms/images-multi.png" },
                                { tag: "", icon: "fas fa-cogs", label: "Predictive Demand Planning", rightImage: "/dvdms/imagesdemand.jpg" }
                            ].map((item, index) => (
                                <div key={index} className="side-feature-row">
                                    <div className="side-feature-left">
                                        <div className="timeline-icon-wrap">
                                            <i className={item.icon}></i>
                                        </div>
                                        <div className="timeline-feature-text">
                                            <div className="feature-meta-tag">{item.tag}</div>
                                            <h5>{item.label}</h5>
                                        </div>
                                    </div>

                                    {/* Right Side Image */}
                                    {item.rightImage && (
                                        <img
                                            src={item.rightImage}
                                            alt={item.label}
                                            className="side-feature-right-img"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Features;