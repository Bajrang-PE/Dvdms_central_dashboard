import React from 'react'
import useScrollVisibility from '../../hooks/useScrollAnimation';

const Features = () => {

    const isVisible = useScrollVisibility('features');

    return (
        <div className="features  pl-5" id='features'>
            <div className={` p-4`} >
                <div className={`${isVisible ? 'slide-in' : 'slide-out'}`}>
                    <h2 className='home-headings'>Features</h2>
                    <h5 className="border-btm"></h5>
                    <br />
                    <h5 style={{ color: "#000e4e" }}>Central Dashboard is an easy to read user
                        interface, provides an array of visualisation involving tabular
                        and various graphical representation of the current status
                        (snapshot) and historical trends of key performance indicators to
                        enable data based informed decisions</h5>
                </div>
            </div>

            <div className='row features-home'>
                {[
                    { icon: "far fa-chart-bar", label: "Statistics" },
                    { icon: "fas fa-user-tie", label: "Role Based User Access" },
                    { icon: "fas fa-filter", label: "Filter" },
                    { icon: "fas fa-level-down-alt", label: "Report Drill Down" },
                    { icon: "fas fa-compress-alt", label: "Comparison" },
                    { icon: "fas fa-cogs", label: "Planning" }
                ].map((item, index) => (
                    <div key={index} className={`col-md-2 col-sm-4 ${isVisible ? 'left-slide-in' : 'left-slide-out'}`}>
                        <div className="feature-icon">
                            <i className={`${item.icon} fa-2x`} aria-hidden="true"></i>
                        </div>
                        <h5>{item.label}</h5>
                    </div>
                ))}
            </div>

            {/* <div className={`row features-home`}>
                <div className={`col-md-2 col-sm-4 ${isVisible ? 'left-slide-in' : 'left-slide-out'}`}>
                    <i className="far fa-chart-bar fa-3x" aria-hidden="true"></i>
                    <h5>Statistics</h5>
                </div>
                <div className={`col-md-2 col-sm-4 ${isVisible ? 'left-slide-in' : 'left-slide-out'}`}>
                    <i className="fas fa-user-tie fa-3x" aria-hidden="true"></i>
                    <h5>Role Based User Access</h5>
                </div>
                <div className={`col-md-2 col-sm-4 ${isVisible ? 'left-slide-in' : 'left-slide-out'}`}>
                    <i className="fas fa-filter fa-3x" aria-hidden="true"></i>
                    <h5>Filter</h5>
                </div>
                <div className={`col-md-2 col-sm-4 ${isVisible ? 'left-slide-in' : 'left-slide-out'}`}>
                    <i className="fas fa-level-down-alt fa-3x" aria-hidden="true"></i>
                    <h5>Report Drill Down</h5>
                </div>
                <div className={`col-md-2 col-sm-4 ${isVisible ? 'left-slide-in' : 'left-slide-out'}`}>
                    <i className="fas fa-compress-alt fa-3x" aria-hidden="true"></i>
                    <h5>Comparison</h5>
                </div>
                <div className={`col-md-2 col-sm-4 ${isVisible ? 'left-slide-in' : 'left-slide-out'}`}>
                    <i className="fas fa-cogs fa-3x" aria-hidden="true"></i>
                    <h5>Planning</h5>
                </div>

            </div> */}
        </div>
    )
}

export default Features
