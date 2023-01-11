import { useRef } from "react/cjs/react.development"
import "../styles/sliderBar.css"
import Card from "./card"
import left from "../images/left.png"
import right from "../images/right.png"

import SwiperCore, { Navigation} from 'swiper'
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
SwiperCore.use([Navigation])

/// Sliderbar con las propiedades data, 
//SPV (slide per view (es la cantidad de imagenes que se van a saltar con cada click) 
//y width, si no definimos el width toma un valor de "100%")
const SliderBar = ({ data, SPV, width = "100%" }) => {

    /// Referencia de los botones del slider, izquierda y derecha
    const navigationPrevRef = useRef(null)
    const navigationNextRef = useRef(null)

    return (
        /// Le entregamos al contenedor general el width de las props
        <div className="swiper-container" style={{ width }} >
            {/* Flecha izquierda con evento OnClick para el div fantasma "next" */}
            <div className="swiper-button-prev-unique" onClick={() => { navigationPrevRef.current.click() }} >
                <img src={left} alt="" className="swiper-btn swiper-left" />
            </div>
            {/* Swiper */}
            <Swiper
            /// Propiedad Navigation para decirle que los divs con las clases "prev" "next" son los que van a hacer de botones
                navigation={{
                    prevEl: '.prev',
                    nextEl: '.next',
                }} 
                /// Slider per Views y Sliders per group son los que configuran cuantos elementos se veran por slide y cuantos 
                /// elementos se saltaran por click
                slidesPerView={SPV} spaceBetween={50} slidesPerGroup={SPV} loop={true} loopFillGroupWithBlank={true} className="mySwiper">
                {/* Hacemos un map de el array e insertamos cada elemento dentro del SwiperSlide
                Tomar en cuenta que Swiper => SwiperSlide => element
                */}
                {data.map((item, index) => {
                    return (
                        <SwiperSlide key={index}>
                            <Card key={index} item={item} />
                        </SwiperSlide>
                    )
                })}
                {/* Divs fantasmas con sus referencias a los Navigation****Ref */}
                <div className="prev" ref={navigationPrevRef} ></div>
                <div className="next" ref={navigationNextRef} ></div>
            </Swiper>
            {/* Flecha derecha con evento OnClick para el div fantasma "next" */}
            <div className="swiper-button-prev-unique" onClick={() => { navigationNextRef.current.click() }} >
                <img src={right} alt="" className="swiper-btn swiper-right" />
            </div>
        </div>
    )
}





export default SliderBar