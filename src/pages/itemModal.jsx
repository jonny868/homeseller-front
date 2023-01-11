///////////// SIN TERMINAR
import "../styles/itemPageModa.css"
import React from 'react'
import Header from "../components/header"
// import img1 from "../../images/house1.jpg"
// import img2 from "../../images/house2.jpg"
// import img3 from "../../images/house3.jpg"
// import img4 from "../../images/house4.jpg"
// import img5 from "../../images/house5.jpg"
// import img6 from "../../images/house6.jpg"
// import img7 from "../../images/house1.jpg"
import pay from "../images/pay.png"
import Card from "../components/card"

import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
// import Swiper core and required modules
// import SwiperCore, {
//     Pagination, Navigation
// } from 'swiper';

export const ItemPageModal = () => {

    const arrayX = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

    return (
        <div className="itemPageModal">
            <Header />
            <main className="_main-info-ctn">
                {/* <img src={img2} className="_img" alt="" /> */}
                <div className="_general-details">
                    <h2>Caracteristicas Generales</h2>
                    <ul>
                        <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum modi ratione dignissimos ullam! Magnam, ea?</li>
                        <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum modi ratione dignissimos ullam! Magnam, ea?</li>
                        <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum modi ratione dignissimos ullam! Magnam, ea?</li>
                        <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum modi ratione dignissimos ullam! Magnam, ea?</li>
                        <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum modi ratione dignissimos ullam! Magnam, ea?</li>
                        <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum modi ratione dignissimos ullam! Magnam, ea?</li>
                    </ul>
                </div>
            </main>
            <section className="_general-ctn">
                <div className="_grid-display">

                </div>
                <div className="_pay-comments-ctn">
                    <div className="_pay-ctn">
                        <h2>Metodos de pago</h2>
                        <img src={pay} alt="" className="_pay-img" />
                        <button className="_btn" >Comprar</button>
                    </div>
                    <div className="_comments-ctn">
                        {/* <Comment />
                        <Comment reply={true} />
                        <Comment /> */}
                    </div>
                </div>
            </section>
            <section className="_slider-ctn">
                <Swiper slidesPerView={5} spaceBetween={50} slidesPerGroup={5} loop={true} loopFillGroupWithBlank={true} navigation={true} className="mySwiper">
                    {arrayX.map((value, index) => {
                        return (
                            <SwiperSlide>
                                <Card key={index} value={value} />
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            </section>
        </div>
    )
}
