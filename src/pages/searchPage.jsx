import "../styles/searchPage.css"
import { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { UserContext } from "../api/userContext"
import api from "../api/api"
import { loadOut } from "../components/loadScreen"
import { Footer } from "../components/footer"
import SliderBar from "../components/sliderBar"

import Banner from "../images/Banner1.png"
import miniLogo from "../images/MiniLogo.png"
import backImage from "../images/searchBackImage.png"


/// Componente Log Out para el header
const LogOut = ({ history }) => {
    /// Extrae el contenido de UserContext 
    const { setUser, setFade, setLoad } = useContext(UserContext)
    return (
        /// Al hacer click vacia el contenido del estado "user" y regresa a la pantalla de inicio
        <p className="pointer" onClick={() => {
            setUser({
                user: "",
                email: "",
                id: "",
            })
            setLoad(true)
            loadOut(setFade, setLoad, history, "/")
        }} >Cerrar Sesión</p>
    )
}

/// Componente Log In para el header
const LogIn = ({ history }) => {
    /// Regresa a la pantalla de inicio
    const { setFade, setLoad } = useContext(UserContext)

    return (
        <p className="pointer" onClick={() => {
            setLoad(true)
            loadOut(setFade, setLoad, history, "/")
        }} >Iniciar Sesion</p>
    )
}

const SearchPage = () => {

    /// Extrae el contenido de UserContext 
    const { user, setFade, setLoad, setMsg, } = useContext(UserContext)
    /// Estado para el input de la search bar
    const [input, setInput] = useState("")
    /// Estado para almacenar en un array las publicaciones que se busquen en la BD
    const [data, setData] = useState([])
    /// UseHistory para navegar entre paginas
    const history = useHistory()
    /// Variable con condicional para saber que tipo de usuario es al momento de ir al perfil
    let perfil = "/company/"
    if (user.type) {
        perfil = "/user/"
    }

    /// Al no haber un boton de "Buscar", si se presiona la tecla "enter" en el searchbar, redirige a la ruta /explore/${input}
    /// La busqueda se realiza en explorePage
    const handleEnter = (e) => {
        if (e.key === "Enter") {
            setLoad(true)
            loadOut(setFade, setLoad, history, `/explore/${input}`)
        }
    }

    /// Al cargar la pagina se realiza una busqueda de todas las publicaciones porque aun no hay filtros de busqueda ni tipos
    /// Ejemplo : mas vendidos, mas visitados, menores precios y asi
    useEffect(() => {
        (async () => {
            const res = await api.getAll()
            if (res.status === 200) {
                /// Almacena los datos en el array setData para luego mostar las publicaciones en el Swiper
                setData(res.data)
            } else {
                setMsg({
                    text: "No se ha podido realizar la busqueda",
                    color: "red"
                })
            }
        })()
        return () => {
        }
        // eslint-disable-next-line
    }, [])


    return (
        <>
            <div className="searchPage">
                <div className="topContent">
                    <img className="_backImage" src={backImage} alt="" />
                    <header className="_header" >
                        <img src={miniLogo} alt="" className="_logo" />
                        <div className="_links">
                            {/* Redirigir a Explore Page */}
                            <p className="pointer" onClick={() => { 
                                setLoad(true)
                                loadOut(setFade, setLoad, history, "/explore/ ") }}>Destacados</p>
                            {/* Si hay un usuario logeado permite cargar el componente que redirige al perfil, caso contrario, retorna nulo */}
                            {user.id !== "" ? <p className="pointer" onClick={() => { 
                                setLoad(true)
                                loadOut(setFade, setLoad, history, `${perfil + user.id}`) }} >Perfil</p> : null}
                            {/* Si hay un usuario logeado retorna el LogOut para cerrar sesion, caso contrario el Login para ir a la pagina de inicio */}
                            {user.id !== "" ? <LogOut history={history} /> : <LogIn history={history} />}
                        </div>
                    </header>
                    <div className="_searchContainer">
                        <p className="_mainText">Realiza una busqueda de tus preferencias y adquiere la casa que tanto ahnelas</p>
                        {/* SearchBar */}
                        <input className="_searchBar" spellCheck="false" type="text" placeholder="Buscar..." onChange={
                            (e) => { setInput(e.target.value) }
                            /// Mira bien el onKeyDown , alli se dispara el "enter" para redirigir a explorer/${input}
                        } onKeyDown={(e) => { handleEnter(e) }} />
                        <p className="_sugestText" >Sugerencias : Casa blanca, Casa de tres pisos, Patio grande...</p>
                    </div>
                </div>
                {/* <SliderBar /> */}
                <SliderBar data={data} SPV={5} width="90%" />
                <div className="_bannerContainer" >
                    <p className="_text" >Proximamente Homeseller disponible para dispositivos móviles.</p>
                    <img src={Banner} alt="" className="banner" />
                </div>
                {/* <SliderBar /> */}
                <SliderBar data={data} SPV={5} width="90%" />
            </div>
            <Footer />
        </>
    )
}


export default SearchPage

