///////////// SIN TERMINAR

import "../styles/ItemPageCinema.css"
import React from 'react'
import Header from '../components/header'
import pay from "../images/pay.png"
import Card from "../components/card"
// import img1 from "../../images/house2.jpg"

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
// import Swiper core and required modules
// import SwiperCore, {
//     Pagination, Navigation
// } from 'swiper';

export const ItemPageCinema = () => {

    const arrayX = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    return (
        <main className="itemPage2" >
            <Header />
            <div className="_cinema-ctn" >
                <div className="_blank"></div>
                <div className="_img-ctn">
                    {/* <img src={img1} alt="" className="_img" /> */}
                </div>
                <div className="_details">
                    <h2>Cocina</h2>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit a commodi iure facere non qui, optio numquam facilis odit voluptatibus architecto et earum tempora expedita nostrum quia excepturi quo ullam.</p>
                </div>
            </div>
            <div className="_general-info-ctn">
                <h2>General Description</h2>
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus qui voluptates reiciendis nam repellendus, provident ut aliquam necessitatibus voluptatem hic! Exercitationem veritatis rerum ad consectetur omnis numquam vel cum nesciunt quaerat qui ullam unde laboriosam molestias non provident quasi quis tenetur deleniti beatae minima expedita, enim dolores? Voluptates maxime aliquid provident dolorem excepturi, laborum rerum quos animi, commodi beatae dolorum!</p>
            </div>
            <div className="_comments-pay-ctn">
                <div className="_comments-ctn">
                    {/* <Comment />
                    <Comment reply={true} />
                    <Comment /> */}
                </div>
                <div className="_pay-ctn">
                    <h2>Metodos de pago</h2>
                    <img src={pay} alt="" className="_pay-img" />
                    <button className="_btn" >Comprar</button>
                </div>
            </div>
            <div className="_slider-ctn" >
                <Swiper slidesPerView={5} spaceBetween={50} slidesPerGroup={5} loop={true} loopFillGroupWithBlank={true} navigation={true} className="mySwiper">
                    {arrayX.map((value, index) => {
                        return (
                            <SwiperSlide>
                                <Card key={index} value={value} />
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            </div>
        </main>
    )
}
