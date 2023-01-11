import { useContext } from "react"
import { UserContext } from "../api/userContext"
import gif from "../images/load.gif"

/// Componente
const LoadScreen = () => {
    /// Usamos Fade para la animacion de el load Screen
    const { fade } = useContext(UserContext)
    return (
        /// Solo es un div con position Fixed para que se quede al top de la pantalla
        <div className={`load-screen ${fade}`}>
            <img src={gif} className="load-gif" alt="" />
        </div>
    )
}
/*
La idea principal del LoadOut es quitar la pantalla de carga, con o sin redireccionar
Por eso primero se hace una verificacion, si no se pasan los parametros "history" y "direction", solo quita la pantalla de carga
en caso contrario redirecciona a la direccion indicada

Estoy pensando en convertir esto en un hook y me ahorro 3 parametros
*/
export const loadOut = (setFade, setLoad, history, direction) => {
    if (history === undefined && direction === undefined) {
        setTimeout(() => {
            setFade("out")
        }, 500);
        setTimeout(() => {
            setLoad(false)
            setFade("in")
        }, 1000);

    } else {
        setTimeout(() => {
            history.push(direction)
            setFade("out")
        }, 500);
        setTimeout(() => {
            setLoad(false)
            setFade("in")
        }, 1000);
    }
}

export default LoadScreen