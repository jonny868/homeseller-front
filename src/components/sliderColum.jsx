import { useEffect, useState } from "react"
import api from "../api/api"
import "../styles/sliderBar.css"
import Card from "./card"

/// Display vertical de las publicaciones
const SliderColum = () => {

    /// Estado para los datos
    const [data, setData] = useState([""])
    useEffect(() => {
        (async()=>{
            /// Leer todas las publicaciones y si todo salio bien insertarla en "data"
            const res = await api.getAll()
            let arr = []
            let i = 0
            if (res.status === 200) {
                /// Definir con un bucle cuantas publicaciones se van a mostrar
                for(i;i < 5;i++){
                    arr.push(res.data[i])
                }
                setData(arr)
            } else {

            }

        })()
        return () => {
            
        }
    }, [])

    return (
        /// Hacer display de cada publicacion
        <div className="sliderColum" >
            {data.map((item,index)=>{
                return <Card key={index} item={item} />
            })}
        </div>
    )
}





export default SliderColum