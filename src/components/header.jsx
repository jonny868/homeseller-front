import { useContext, useState } from "react"
import { useHistory } from "react-router-dom"
import { UserContext } from "../api/userContext"
import miniLogo from "../images/MiniLogo.png"
import { loadOut} from "./loadScreen"


/// Header
const Header = () => {

    /// Estado para el input de la searchBar
    const [input, setInput] = useState("")

    /// Use history para cambiar entre paginas
    const history = useHistory()

    /// Extraemos variables del UserContext
    const { user, setUser, setFade, setLoad } = useContext(UserContext)

    /// Verificamos que tipo de perfil es el usuario
    let perfil = "/company/"
    if (user.type) {
        perfil = "/user/"
    }

    /// log out
    const LogOut = () => {
        return (
            <p className="pointer" onClick={() => {
                setLoad(true)
                loadOut(setFade, setLoad, history, "/")
                setUser({
                    user: "",
                    email: "",
                    id: "",
                })
            }} >Cerrar Sesión</p>
        )
    }

    /// log in
    const LogIn = () => {
        return (
            <p className="pointer" onClick={() => { loadOut(setFade, setLoad, history, "/") }} >Iniciar Sesion</p>
        )
    }

    /// En caso de que se presione "enter" en la searchbar, realizar la busqueda
    /// La busqueda consiste en cambiar la url de "explorePage" y esta cuando se renderiza busca las cosas automaticamente
    const handleEnter = (e) => {
        if (e.key === "Enter") {
            loadOut(setFade, setLoad, history, `/explore/${input}`)
        }
    }


    return (
        /// El logo redirige a la SearchPage
        <header className="headerFlat" >
            <img src={miniLogo} alt="" className="_logo" onClick={() => { 
                setLoad(true)
                loadOut(setFade, setLoad, history, "/search") }} />
            {/* Searchbar */}
            <input type="text" className="_input" placeholder="Buscar..." value={input} onChange={(e) => { setInput(e.target.value) }} onKeyDown={handleEnter} spellCheck={false} />
            <div className="_links">
                <p className="pointer" onClick={() => { 
                    setLoad(true)
                    loadOut(setFade, setLoad, history, "/explore/ ") }}>Destacados</p>
                {/* Esta logica esta explicada en el Header de SearchPage */}
                {user.id !== "" ? <p className="pointer" onClick={() => { 
                    setLoad(true)
                    loadOut(setFade, setLoad, history, `${perfil + user.id}`) }} >Perfil</p> : null}
                {user.id !== "" ? <LogOut /> : <LogIn />}
            </div>
        </header >
    )
}

export default Header