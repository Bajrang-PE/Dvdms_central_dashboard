import React from 'react';
import { imageUrls } from '../../localData/HomeData';

const HomeSlider = () => {

    return (
        <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">

            <div className="carousel-indicators">
                {imageUrls?.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        data-bs-target="#carouselExample"
                        data-bs-slide-to={index}
                        className={index === 0 ? 'active' : ''}
                        aria-current={index === 0 ? 'true' : 'false'}
                        aria-label={`Slide ${index + 1}`}
                        style={{backgroundColor:"#052963"}}
                    ></button>
                ))}
            </div>

            <div className="carousel-inner">
                {imageUrls?.map((url, index) => (
                    <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                        <img src={url} className="w-100 h-100" alt={`Slide ${index + 1}`} />
                    </div>
                ))}
            </div>

            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                <i className="fas fa-angle-left" aria-hidden="true"></i>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                <i className="fas fa-angle-right" aria-hidden="true"></i>
            </button>
        </div>
    );
};

export default HomeSlider;
