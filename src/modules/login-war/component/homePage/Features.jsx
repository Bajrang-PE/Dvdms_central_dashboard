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
                    gap: 14px;
                    padding: 10px 0;
                    border-bottom: 1px dashed #e2e8f0;
                }

                .side-feature-row:last-child {
                    border-bottom: none;
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

                /* Standard Pill Buttons styling */
                .view-all-btn-wrap {
                    text-align: center;
                    margin-top: 16px;
                }

                .view-all-pill {
                    display: inline-block;
                    padding: 5px 18px;
                    border: 1px solid #cbd5e1;
                    border-radius: 20px;
                    font-size: 11.5px;
                    font-weight: 600;
                    color: #475569;
                    text-decoration: none;
                    background: #ffffff;
                    transition: all 0.2s ease;
                }

                .view-all-pill:hover {
                    background: #f8fafc;
                    color: #0f172a;
                    border-color: #94a3b8;
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
                    <h2 className="panel-main-title">News / Press Release</h2>
                    <p className="panel-sub-tagline">Your Gateway to Authentic News</p>

                    <div className="news-items-stack">

                        <div className="news-card">
                            <div className="news-source-badge badge-air">
                                <span className="badge-icon-text">AIR</span>
                                <span className="badge-sub-text">News</span>
                            </div>
                            <div className="news-content-area">
                                <div className="news-meta-header">News on AIR</div>
                                <h4 className="news-headline-text">Health Minister Jagat Prakash Nadda reaffirms commitment to eliminate Sickle Cell disease by 2047</h4>
                            </div>
                            <span className="news-time-stamp">8 m ago</span>
                        </div>

                        <div className="news-card">
                            <div className="news-source-badge badge-air">
                                <span className="badge-icon-text">AIR</span>
                                <span className="badge-sub-text">News</span>
                            </div>
                            <div className="news-content-area">
                                <div className="news-meta-header">News on AIR</div>
                                <h4 className="news-headline-text">Government highlights 12-year transformation of North-East under PM Modi</h4>
                            </div>
                            <span className="news-time-stamp">11 m ago</span>
                        </div>

                        <div className="news-card">
                            <div className="news-source-badge badge-air">
                                <span className="badge-icon-text">AIR</span>
                                <span className="badge-sub-text">News</span>
                            </div>
                            <div className="news-content-area">
                                <div className="news-meta-header">News on AIR</div>
                                <h4 className="news-headline-text">Union Minister Ashwini Vaishnaw praises Bihar's efforts in promoting IT sector development</h4>
                            </div>
                            <span className="news-time-stamp">16 m ago</span>
                        </div>

                        <div className="news-card">
                            <div className="news-source-badge badge-dd">
                                <span className="badge-icon-text">DD</span>
                                <span className="badge-sub-text">News</span>
                            </div>
                            <div className="news-content-area">
                                <div className="news-meta-header">DD News</div>
                                <h4 className="news-headline-text">President Murmu highlights India's sickle cell elimination mission at Omkareshwar event</h4>
                            </div>
                            <span className="news-time-stamp">58 m ago</span>
                        </div>

                        <div className="news-card">
                            <div className="news-source-badge badge-dd">
                                <span className="badge-icon-text">DD</span>
                                <span className="badge-sub-text">News</span>
                            </div>
                            <div className="news-content-area">
                                <div className="news-meta-header">DD News</div>
                                <h4 className="news-headline-text">Chhapra-Delhi Express launch, Patna station expansion, locomotive exports to Guinea: Ashwini Vaishnaw outlines Bihar's Rs 10,000 crore rail push</h4>
                            </div>
                            <span className="news-time-stamp">1 h ago</span>
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
                                <div className="spotlight-month-tag">June 2026</div>
                                <h4 className="spotlight-main-heading">DVDMS Central Dashboard</h4>
                                {/* <p className="spotlight-body-desc">
                                    The DVDMS Central Dashboard provides an enterprise-grade analytical framework that monitors procurement lifecycles, stock thresholds, and delivery pipelines. By visualising complex pharmaceutical data stream, it drives informed decision-making to optimize health supplies across state networks.
                                </p> */}
                                <p className="spotlight-body-desc">
                                    The DVDMS Central Dashboard delivers an enterprise-grade analytical and monitoring framework for the Integrated Drug and Vaccine Distribution Management System. It enables real-time tracking of procurement lifecycles, inventory levels, stock thresholds, and distribution pipelines across multiple tiers of the public health supply chain. By transforming complex pharmaceutical and logistics data into actionable visual insights, the platform supports evidence-based decision-making, improves supply chain transparency, and helps optimize the availability of essential medicines and vaccines across state and district health networks.
                                </p>
                            </div>
                        </div>

                        {/* RIGHT INNER SUBFRAME: Features Stack List with Micro-Dashed Grids */}
                        <div className="features-side-list">
                            {[
                                { tag: "Feature 01", icon: "far fa-chart-bar", label: "Real-time Statistics" },
                                { tag: "Feature 02", icon: "fas fa-user-tie", label: "Role Based User Access" },
                                { tag: "Feature 03", icon: "fas fa-filter", label: "Advanced Filter Engine" },
                                { tag: "Feature 04", icon: "fas fa-level-down-alt", label: "Granular Drill Down Reports" },
                                { tag: "Feature 05", icon: "fas fa-compress-alt", label: "Multi-Warehouse Comparison" },
                                { tag: "Feature 06", icon: "fas fa-cogs", label: "Predictive Demand Planning" }
                            ].map((item, index) => (
                                <div key={index} className="side-feature-row">
                                    <div className="timeline-icon-wrap">
                                        <i className={item.icon}></i>
                                    </div>
                                    <div className="timeline-feature-text">
                                        <div className="feature-meta-tag">{item.tag}</div>
                                        <h5>{item.label}</h5>
                                    </div>
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