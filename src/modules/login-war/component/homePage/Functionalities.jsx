import React, { useRef } from 'react'
import { functionalityData } from '../../localData/HomeData';
import useScrollVisibility from '../../hooks/useScrollAnimation';
import "./Functionalities.css";

const Functionalities = () => {
    const isVisible = useScrollVisibility('functionalities');
    const scrollTrackRef = useRef(null);

    // Arrow click par cleanly 220px standard distance scroll badhane ke liye logic
    const scroll = (direction) => {
        if (scrollTrackRef.current) {
            const scrollAmount = direction === 'left' ? -220 : 220;
            scrollTrackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="panel-content-wrapper right-side-padding" id='functionalities'>
            <div className={`panel-header-section dark-text ${isVisible ? 'slide-in' : 'slide-out'}`}>
                <h4 className="scroller-section-subtitle">Interact & Explore</h4>
                <h2 className="panel-main-title dark">System Functionalities</h2>
            </div>
            
            {/* Wrapper container handles alignment and layout spacing separation */}
            <div className="scroller-relative-container">
                
                {/* Left Arrow Button - Restored with Icon */}
                <button className="scroller-arrow-btn left-arrow" onClick={() => scroll('left')} aria-label="Scroll Left">
                    <i className="fas fa-chevron-left"></i>
                </button>

                {/* --- HORIZONTAL SCROLLER TRACK --- */}
                <div className="horizontal-scrollable-track mt-4" ref={scrollTrackRef}>
                    {functionalityData?.length > 0 ? functionalityData?.map((fn, index) => (
                        <div className="scrollable-circle-item" key={index}>
                            <div className="circle-avatar-box">
                                <img src={fn?.imgUrl} alt={fn?.title} />
                            </div>
                            <div className="circle-card-body text-center mt-3">
                                <h5 className="circle-card-title">{fn?.title}</h5>
                            </div>
                        </div>
                    )) : (
                        <div className="w-100 text-center py-5">
                            <h6 className="text-muted">No Functionalities Available</h6>
                        </div>
                    )}
                </div>

                {/* Right Arrow Button - Restored with Icon */}
                <button className="scroller-arrow-btn right-arrow" onClick={() => scroll('right')} aria-label="Scroll Right">
                    <i className="fas fa-chevron-right"></i>
                </button>
              
            </div>

            {/* Slider Indicators Bottom Center */}
            {/* <div className="d-flex justify-content-center align-items-center mt-4 container-dots-ui">
                <span className="dot-ui active"></span>
                <span className="dot-ui"></span>
                <span className="dot-ui"></span>
            </div> */}
        </div>
    )
}

export default Functionalities