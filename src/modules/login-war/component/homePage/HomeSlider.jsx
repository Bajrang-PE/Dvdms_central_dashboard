// import React from 'react';
// import { imageUrls } from '../../localData/HomeData';

// // Reading directly from the \DVDMS\public folder root
// const partnerLogos = [
//     { id: 1, src: "/dvdms/Untitled.jpg", alt: "CMSS", isSpecialCrop: false },
//     { id: 2, src: "/dvdms/_90795923_c0023734-h1n1_flu_virus_particle_artwork-spl.jpg", alt: "COVID-19", isSpecialCrop: false },
//     { id: 3, src: "/dvdms/unnamed.png", alt: "eSanjeevani", isSpecialCrop: false },
//     { id: 4, src: "/dvdms/imagesjanni.jpg", alt: "Surakshet Janani", isSpecialCrop: false },
//     { id: 5, src: "/dvdms/imagesjodi.jpg", alt: "Jodi Zimmedar", isSpecialCrop: true }, // Crops the bottom text line perfectly
//     { id: 6, src: "/dvdms/nrcp.png", alt: "NRCP", isSpecialCrop: false }
// ];

// const HomeSlider = () => {
//     return (
//         <>
//             <style dangerouslySetInnerHTML={{__html: `
//                 /* Main Container Block */
//                 .dvdms-slider-section-wrapper {
//                     position: relative;
//                     width: 100%;
//                     background: transparent;
//                     margin-top: 100px; 
//                 }

//                 /* THE BOTTOM BLUE BOX */
//                 .dvdms-gradient-bg {
//                     position: relative;
//                     background: linear-gradient(135deg, #00183f 0%, #002d80 50%, #00112c 100%);
//                     padding-top: 260px;  
//                     padding-bottom: 40px;
//                     text-align: center;
//                     border-radius: 16px;
//                     width: 100%;
//                     z-index: 1;
//                 }

//                 /* THE BIG MAIN CAROUSEL BANNER */
//                 .dvdms-floating-banner {
//                     position: absolute;
//                     top: 0; 
//                     left: 50%;
//                     transform: translate(-50%, -40%); 
//                     width: 92%;          
//                     max-width: 1250px;   
//                     z-index: 10;
//                     box-shadow: 0 22px 50px rgba(0, 0, 0, 0.28);
//                     border: 1px solid rgba(255, 255, 255, 0.1);
//                     border-radius: 24px; 
//                     overflow: hidden;
//                     background: #ffffff;
//                 }

//                 .dvdms-floating-banner .carousel-inner {
//                     border-radius: 24px;
//                 }

//                 .dvdms-floating-banner .carousel-item {
//                     height: 415px;   
//                     background: #ffffff;
//                 }

//                 .dvdms-floating-banner .carousel-item img {
//                     width: 100%;
//                     height: 100%;
//                     object-fit: contain;
//                     object-position: center;
//                 }

//                 /* --- 6 CIRCULAR LOGOS GRID --- */
//                 .dvdms-logos-grid {
//                     display: flex;
//                     justify-content: center;
//                     align-items: center;
//                     gap: 30px;
//                     margin-bottom: 35px;
//                     flex-wrap: wrap;
//                     padding: 0 20px;
//                 }

//                 .dvdms-logo-circle {
//                     width: 90px;   
//                     height: 90px;  
//                     background: #ffffff;
//                     border-radius: 50%;
//                     display: flex;
//                     justify-content: center;
//                     align-items: center;
//                     box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
//                     transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
//                     padding: 0px;  
//                     border: 3px solid rgba(255, 255, 255, 0.95);
//                     overflow: hidden; 
//                 }

//                 .dvdms-logo-circle:hover {
//                     transform: translateY(-6px) scale(1.06);
//                     box-shadow: 0 15px 30px rgba(255, 255, 255, 0.15);
//                     border-color: #38bdf8;
//                 }

//                 .dvdms-logo-circle img {
//                     width: 100%;
//                     height: 100%;
//                     object-fit: cover; 
//                 }

//                 .dvdms-logo-circle img.crop-jodi-text {
//                     width: 100%;
//                     height: 100%; 
//                     object-fit: cover;
//                     object-position: top center; 
//                 }

//                 /* --- UPDATED & FIXED CAROUSEL ARROWS --- */
//                 .dvdms-floating-banner .carousel-control-prev,
//                 .dvdms-floating-banner .carousel-control-next {
//                     width: 46px !important;
//                     height: 46px !important;
//                     background: rgba(255, 255, 255, 0.9) !important;
//                     border: 1px solid rgba(0, 45, 128, 0.15) !important;
//                     border-radius: 50% !important;
//                     color: #002d80 !important;
//                     opacity: 0.85 !important;
//                     top: 50% !important;
//                     transform: translateY(-50%) !important;
//                     box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15) !important;
//                     z-index: 12;
//                     transition: all 0.2s ease-in-out !important;
//                     display: flex !important;
//                     align-items: center !important;
//                     justify-content: center !important;
//                 }

//                 /* Hover State for Elegance */
//                 .dvdms-floating-banner .carousel-control-prev:hover,
//                 .dvdms-floating-banner .carousel-control-next:hover {
//                     background: #002d80 !important;
//                     color: #ffffff !important;
//                     opacity: 1 !important;
//                     box-shadow: 0 6px 20px rgba(0, 45, 128, 0.3) !important;
//                     border-color: #002d80 !important;
//                 }

//                 /* Inward padding spacing taaki screen se touch ya cut na ho */
//                 .dvdms-floating-banner .carousel-control-prev { left: 20px !important; }
//                 .dvdms-floating-banner .carousel-control-next { right: 20px !important; }

//                 /* FontAwesome Icons adjustment inside circles */
//                 .dvdms-floating-banner .carousel-control-prev i,
//                 .dvdms-floating-banner .carousel-control-next i {
//                     font-size: 16px !important;
//                     font-weight: 900;
//                 }

//                 /* Text Styling */
//                 .dvdms-main-heading {
//                     color: #ffffff;
//                     font-size: 28px;
//                     font-weight: 800;
//                     margin-bottom: 8px !important;
//                     letter-spacing: 0.5px;
//                 }

//                 .dvdms-sub-heading {
//                     color: #ffffff;
//                     font-size: 15px;
//                     font-weight: 400;
//                     line-height: 1.5;
//                     opacity: 0.95;
//                     margin-bottom: 0 !important;
//                 }

//                 @media (max-width: 991px) {
//                     .dvdms-slider-section-wrapper { margin-top: 60px; }
//                     .dvdms-floating-banner {
//                         width: 95%;
//                         border-radius: 16px;
//                         transform: translate(-50%, -30%);
//                     }
//                     .dvdms-floating-banner .carousel-item { height: auto; }
//                     .dvdms-gradient-bg { padding-top: 240px; }
//                     .dvdms-logo-circle {
//                         width: 70px;
//                         height: 70px;
//                     }
//                     .dvdms-logos-grid { gap: 15px; }
//                     /* Choti screens par arrows ko halka sa chota aur corners par set kiya */
//                     .dvdms-floating-banner .carousel-control-prev { left: 10px !important; }
//                     .dvdms-floating-banner .carousel-control-next { right: 10px !important; }
//                     .dvdms-floating-banner .carousel-control-prev,
//                     .dvdms-floating-banner .carousel-control-next {
//                         width: 36px !important;
//                         height: 36px !important;
//                     }
//                 }
//             `}} />

//             <div className="dvdms-slider-section-wrapper">
                
//                 {/* FLOATING CAROUSEL BANNER USING ORIGINAL URLS */}
//                 <div id="carouselExample" className="carousel slide dvdms-floating-banner" data-bs-ride="carousel">
//                     <div className="carousel-inner">
//                         {imageUrls?.map((url, index) => (
//                             <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
//                                 <img src={url} alt={`Slide ${index + 1}`} />
//                             </div>
//                         ))}
//                     </div>

//                     <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
//                         <i className="fas fa-chevron-left" aria-hidden="true"></i>
//                     </button>
//                     <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
//                         <i className="fas fa-chevron-right" aria-hidden="true"></i>
//                     </button>
//                 </div>

//                 {/* BOTTOM GRADIENT PANEL WITH BRAND LOGOS */}
//                 <div className="dvdms-gradient-bg">
                    
//                     {/* Rendered circles linked directly to public files */}
//                     <div className="dvdms-logos-grid">
//                         {partnerLogos.map((logo) => (
//                             <div key={logo.id} className="dvdms-logo-circle">
//                                 <img 
//                                     src={logo.src} 
//                                     alt={logo.alt} 
//                                     className={logo.isSpecialCrop ? "crop-jodi-text" : ""} 
//                                 />
//                             </div>
//                         ))}
//                     </div>

//                     {/* HEADINGS */}
//                     <h5 className="dvdms-main-heading">DVDMS CENTRAL DASHBOARD</h5>
//                     <p className="dvdms-sub-heading">
//                         Ministry of Health &amp; Family Welfare<br /> (Govt. of India)
//                     </p>
//                 </div>

//             </div>
//         </>
//     );
// };

// export default HomeSlider;





import React from 'react';
import { imageUrls } from '../../localData/HomeData';

// Reading directly from the \DVDMS\public folder root
const partnerLogos = [
    { id: 1, src: "/dvdms/Untitled.jpg", alt: "CMSS", isSpecialCrop: false },
    { id: 2, src: "/dvdms/_90795923_c0023734-h1n1_flu_virus_particle_artwork-spl.jpg", alt: "COVID-19", isSpecialCrop: false },
    { id: 3, src: "/dvdms/unnamed.png", alt: "eSanjeevani", isSpecialCrop: false },
    { id: 4, src: "/dvdms/imagesjanni.jpg", alt: "Surakshet Janani", isSpecialCrop: false },
    { id: 5, src: "/dvdms/imagesjodi.jpg", alt: "Jodi Zimmedar", isSpecialCrop: true }, // Crops the bottom text line perfectly
    { id: 6, src: "/dvdms/nrcp.png", alt: "NRCP", isSpecialCrop: false }
];

const HomeSlider = () => {
    return (
        <>
            <style dangerouslySetInnerHTML={{__html: `
                /* Main Container Block */
                .dvdms-slider-section-wrapper {
                    position: relative;
                    width: 100%;
                    background: transparent;
                    margin-top: 100px; 
                }

                /* THE BOTTOM BACKGROUND BOX (Dynamically Theme Compatible) */
                .dvdms-gradient-bg {
                    position: relative;
                    background: var(--primary-color, linear-gradient(135deg, #00183f 0%, #002d80 50%, #00112c 100%));
                    transition: background 0.3s ease-in-out;
                    padding-top: 260px;  
                    padding-bottom: 40px;
                    text-align: center;
                    border-radius: 16px;
                    width: 100%;
                    z-index: 1;
                }

                /* THE BIG MAIN CAROUSEL BANNER */
                .dvdms-floating-banner {
                    position: absolute;
                    top: 0; 
                    left: 50%;
                    transform: translate(-50%, -40%); 
                    width: 92%;          
                    max-width: 1250px;   
                    z-index: 10;
                    box-shadow: 0 22px 50px rgba(0, 0, 0, 0.28);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px; 
                    overflow: hidden;
                    background: #ffffff;
                }

                .dvdms-floating-banner .carousel-inner {
                    border-radius: 24px;
                }

                .dvdms-floating-banner .carousel-item {
                    height: 415px;   
                    background: #ffffff;
                }

                .dvdms-floating-banner .carousel-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    object-position: center;
                }

                /* --- 6 CIRCULAR LOGOS GRID --- */
                .dvdms-logos-grid {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 30px;
                    margin-bottom: 35px;
                    flex-wrap: wrap;
                    padding: 0 20px;
                }

                .dvdms-logo-circle {
                    width: 90px;   
                    height: 90px;  
                    background: #ffffff;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
                    padding: 0px;  
                    border: 3px solid rgba(255, 255, 255, 0.95);
                    overflow: hidden; 
                }

                .dvdms-logo-circle:hover {
                    transform: translateY(-6px) scale(1.06);
                    box-shadow: 0 15px 30px rgba(255, 255, 255, 0.15);
                    border-color: #38bdf8;
                }

                .dvdms-logo-circle img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover; 
                }

                .dvdms-logo-circle img.crop-jodi-text {
                    width: 100%;
                    height: 100%; 
                    object-fit: cover;
                    object-position: top center; 
                }

                /* --- UPDATED & FIXED CAROUSEL ARROWS --- */
                .dvdms-floating-banner .carousel-control-prev,
                .dvdms-floating-banner .carousel-control-next {
                    width: 46px !important;
                    height: 46px !important;
                    background: rgba(255, 255, 255, 0.9) !important;
                    border: 1px solid rgba(0, 45, 128, 0.15) !important;
                    border-radius: 50% !important;
                    color: var(--primary-color, #002d80) !important;
                    opacity: 0.85 !important;
                    top: 50% !important;
                    transform: translateY(-50%) !important;
                    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15) !important;
                    z-index: 12;
                    transition: all 0.2s ease-in-out !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }

                /* Hover State for Elegance */
                .dvdms-floating-banner .carousel-control-prev:hover,
                .dvdms-floating-banner .carousel-control-next:hover {
                    background: var(--primary-color, #002d80) !important;
                    color: #ffffff !important;
                    opacity: 1 !important;
                    box-shadow: 0 6px 20px rgba(0, 45, 128, 0.3) !important;
                    border-color: var(--primary-color, #002d80) !important;
                }

                /* Inward padding spacing taaki screen se touch ya cut na ho */
                .dvdms-floating-banner .carousel-control-prev { left: 20px !important; }
                .dvdms-floating-banner .carousel-control-next { right: 20px !important; }

                /* FontAwesome Icons adjustment inside circles */
                .dvdms-floating-banner .carousel-control-prev i,
                .dvdms-floating-banner .carousel-control-next i {
                    font-size: 16px !important;
                    font-weight: 900;
                }

                /* Text Styling */
                .dvdms-main-heading {
                    color: #ffffff;
                    font-size: 28px;
                    font-weight: 800;
                    margin-bottom: 8px !important;
                    letter-spacing: 0.5px;
                }

                .dvdms-sub-heading {
                    color: #ffffff;
                    font-size: 15px;
                    font-weight: 400;
                    line-height: 1.5;
                    opacity: 0.95;
                    margin-bottom: 0 !important;
                }

                @media (max-width: 991px) {
                    .dvdms-slider-section-wrapper { margin-top: 60px; }
                    .dvdms-floating-banner {
                        width: 95%;
                        border-radius: 16px;
                        transform: translate(-50%, -30%);
                    }
                    .dvdms-floating-banner .carousel-item { height: auto; }
                    .dvdms-gradient-bg { padding-top: 240px; }
                    .dvdms-logo-circle {
                        width: 70px;
                        height: 70px;
                    }
                    .dvdms-logos-grid { gap: 15px; }
                    /* Choti screens par arrows ko halka sa chota aur corners par set kiya */
                    .dvdms-floating-banner .carousel-control-prev { left: 10px !important; }
                    .dvdms-floating-banner .carousel-control-next { right: 10px !important; }
                    .dvdms-floating-banner .carousel-control-prev,
                    .dvdms-floating-banner .carousel-control-next {
                        width: 36px !important;
                        height: 36px !important;
                    }
                }
            `}} />

            <div className="dvdms-slider-section-wrapper">
                
                {/* FLOATING CAROUSEL BANNER USING ORIGINAL URLS */}
                <div id="carouselExample" className="carousel slide dvdms-floating-banner" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        {imageUrls?.map((url, index) => (
                            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                <img src={url} alt={`Slide ${index + 1}`} />
                            </div>
                        ))}
                    </div>

                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                        <i className="fas fa-chevron-left" aria-hidden="true"></i>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                        <i className="fas fa-chevron-right" aria-hidden="true"></i>
                    </button>
                </div>

                {/* BOTTOM GRADIENT PANEL WITH BRAND LOGOS */}
                <div className="dvdms-gradient-bg">
                    
                    {/* Rendered circles linked directly to public files */}
                    <div className="dvdms-logos-grid">
                        {partnerLogos.map((logo) => (
                            <div key={logo.id} className="dvdms-logo-circle">
                                <img 
                                    src={logo.src} 
                                    alt={logo.alt} 
                                    className={logo.isSpecialCrop ? "crop-jodi-text" : ""} 
                                />
                            </div>
                        ))}
                    </div>

                    {/* HEADINGS */}
                    <h5 className="dvdms-main-heading">DVDMS CENTRAL DASHBOARD</h5>
                    <p className="dvdms-sub-heading">
                        Ministry of Health &amp; Family Welfare<br /> (Govt. of India)
                    </p>
                </div>

            </div>
        </>
    );
};

export default HomeSlider;