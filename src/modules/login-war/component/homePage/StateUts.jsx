// export default StateUts
import React, { useRef } from 'react'
import { stateData } from '../../localData/HomeData'
import useScrollVisibility from '../../hooks/useScrollAnimation';

const StateUts = () => {
    const isVisible = useScrollVisibility('state');
    const scrollRef = useRef(null);

    // Left/Right scroll functionality
    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - 300 : scrollLeft + 300;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <div id='state' className="state-carousel-wrapper">
            {/* Left Arrow */}
            <button className="carousel-arrow left" onClick={() => scroll('left')}>
                <i className="fas fa-chevron-left"></i>
            </button>

            <div className="state-horizontal-scroll-container" ref={scrollRef}>
                {stateData?.map((state, index) => (
                    <div 
                        className={`state-big-card-wrapper ${isVisible ? 'fade-in' : 'fade-out'}`} 
                        key={index}
                    >
                        <a href={state?.link} target="_blank" rel="noreferrer" className="state-card-link">
                            <div className="state-premium-card">
                                <img 
                                    className='state-card-img' 
                                    src={state?.imgUrl} 
                                    alt={`${state?.stateName} image`} 
                                />
                                <div className="state-card-overlay">
                                    <span className="state-card-name">{state?.stateName}</span>
                                </div>
                            </div>
                        </a>
                    </div>
                ))}
            </div>

            {/* Right Arrow */}
            <button className="carousel-arrow right" onClick={() => scroll('right')}>
                <i className="fas fa-chevron-right"></i>
            </button>

            <style>
                {`
                    .state-carousel-wrapper {
                        position: relative;
                        display: flex;
                        align-items: center;
                        width: 100%;
                        padding: 0 40px;
                    }

                    .state-horizontal-scroll-container {
                        display: flex;
                        flex-wrap: nowrap;
                        overflow-x: auto;
                        gap: 25px;
                        padding: 15px 5px;
                        scroll-behavior: smooth;
                        scrollbar-width: none; /* Firefox */
                    }

                    .state-horizontal-scroll-container::-webkit-scrollbar {
                        display: none; /* Chrome/Safari */
                    }

                    .state-big-card-wrapper {
                        flex: 0 0 auto;
                        width: 200px; /* Bada size jaisa aapne manga */
                    }

                    .state-premium-card {
                        position: relative;
                        width: 100%;
                        height: 110px; /* Increased height */
                        border-radius: 10px;
                        overflow: hidden;
                        border: 3px solid #ffffff; /* White border as requested */
                        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                        transition: transform 0.3s ease, border-color 0.3s ease;
                        background: rgba(255, 255, 255, 0.1); /* Transparent feel */
                    }

                    .state-premium-card:hover {
                        transform: scale(1.05);
                        border-color: #38bdf8;
                    }

                    .state-card-img {
                        width: 100%; border-radius: 10px;     
                        height: 100%;
                        object-fit: cover;
                        display: block;
                    }

                    .state-card-overlay {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        background: linear-gradient(to top, rgba(0,0,0,0.8) 20%, transparent 100%);
                        padding: 8px;
                        text-align: center;
                    }

                    .state-card-name {
                        color: #ffffff;
                        font-size: 12px;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }

                    /* Carousel Arrows Styling */
                    .carousel-arrow {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.2);
                        border: 2px solid white;
                        color: white;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;
                        z-index: 100;
                        transition: all 0.2s ease;
                    }

                    .carousel-arrow:hover {
                        background: #ffffff;
                        color: #002147;
                    }

                    .carousel-arrow.left { left: 0; }
                    .carousel-arrow.right { right: 0; }
                `}
            </style>
        </div>
    )
}

export default StateUts