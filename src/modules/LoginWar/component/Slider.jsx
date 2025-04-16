import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { functionalityData } from '../localData/HomeData';

const Slider = () => {
    return (
        <Swiper
        grabCursor={true}
        centeredSlides={false}
        loop={false}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        slidesPerView={1} 
        spaceBetween={20}
        navigation={true} 
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination, Autoplay]}
        breakpoints={{
          640: { slidesPerView: 1 }, 
          768: { slidesPerView: 2 }, 
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 }, 
        }}
        className="mySwiper"
        >
            {functionalityData.map((item, index) => (
                <SwiperSlide key={index}>
                    <div className="functionality-card">
                        <img src={item.imgUrl} alt={item.title} />
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

export default Slider
