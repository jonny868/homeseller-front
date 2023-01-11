import { useHistory } from "react-router"
import { useContext } from "react/cjs/react.development"
import { UserContext } from "../api/userContext"
import stars from "../images/Stars.png"
import { loadOut } from "./loadScreen"

/// Componente de la publicacion
/// En vez de usar (props.item), accedemos a los datos de una vez con ({item})
const Card = ({item}) => {
    /// Extraemos de UserContext
    const {setFade,setLoad} = useContext(UserContext)
    /// UseHistory para navegar entre paginas
    const history = useHistory()

    /// Funcion para redirigirnos a la pagina del item al hacer click en el
    const sendToItem =()=>{
        setLoad(true)
        loadOut(setFade,setLoad,history,`/itemPage/${item.id}`)
    }

    return (
        /// Presentamos en cada parte de la carta los datos de la publicacion
        <div className="card" onClick={sendToItem}  >
            <img className="_picture" src={item ? item.images[0].url : null} alt="" />
            <div className="_content">
                <div className="_details">
                    <p className="_price" > { item ? "$" + item.price : "0$"}</p>
                    {/* <img className="_stars" src={stars} alt="" /> */}
                </div>
                <p className="_description" >{item ? item.title : null}</p>
            </div>
        </div>
    )
}

export default Card